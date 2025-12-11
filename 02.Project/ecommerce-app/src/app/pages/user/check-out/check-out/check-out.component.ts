import { Component, computed, OnInit, signal } from '@angular/core';
import { Cart } from '../../../../core/types/Cart';
import { Observable, of, take } from 'rxjs';
import { PaymentMethod } from '../../../../core/types/PaymentMethod';
import { CartService } from '../../../../core/services/cart/cart.service';
import { PaymentService } from '../../../../core/services/paymentMethods/payment-methods.service';
import { Store } from '@ngrx/store';
import { OrderService } from '../../../../core/services/order/order.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { selectUserId } from '../../../../core/store/auth/auth.selectors';
import { Order } from '../../../../core/types/Order';
import { PaymentMethodsListComponent } from "../../../../components/payment/payment-methods-list/payment-methods-list/payment-methods-list.component";
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import { ShippingAddress } from '../../../../core/types/shippingAddress';
import { ShippingAddressService } from '../../../../core/services/shippingAddress/shipping-address.service';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [PaymentMethodsListComponent, RouterLink, CurrencyPipe, AsyncPipe],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent implements OnInit {

  cartSig = signal<Cart | null>(null);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  paymentMethod$: Observable<PaymentMethod[]> = of([]);

  // ✔ AGREGADO
  shippingAddress$: Observable<ShippingAddress[]> = of([]);
  selectedShippingAddressId: string = '';  // ← NUEVO

  paymentMethodId: string = '';

  total = computed(() =>
    this.cartSig()?.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0) || 0
  );

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private store: Store,
    private orderservice: OrderService,
    private router: Router,
    private toast: ToastService,
    private shippingAddressService: ShippingAddressService // ✔ AGREGADO
  ) {}

ngOnInit(): void {
  const userId = this.getUserId();
  if (!userId) return;

  this.cartService.cart$.subscribe(cart => this.cartSig.set(cart));

  this.paymentService.loadPayMethods();
  this.paymentMethod$ = this.paymentService.paymetMethods$;

  this.paymentMethod$.pipe(take(1)).subscribe(payments => {
    if (payments.length > 0) {
      this.paymentMethodId = payments[0]._id; // ✔ AUTO-SELECCIÓN
    }
  });

  this.shippingAddress$ = this.shippingAddressService.getShippingAddressesByUser(userId);

  this.shippingAddress$.pipe(take(1)).subscribe(addresses => {
    if (addresses.length > 0) {
      this.selectedShippingAddressId = addresses[0]._id; // ✔ AUTO-SELECCIÓN
    }
  });
}


  onPaymentMethodSelected(id: string) {
    this.paymentMethodId = id;
      console.log("Método de pago seleccionado:", id);
  }

  submitOrder() {
    const cart = this.cartSig();
    const userId = this.getUserId();

    if (!cart || !userId) return;

    this.loading.set(true);

    // ✔ Dirección asignada automáticamente
    const orderPayload: Order = {
      user: userId,
      products: cart.products.map(p => ({
        productId: p.product._id,
        quantity: p.quantity,
        price: p.product.price
      })),
      totalPrice: this.total(),
      status: 'pending',
        shippingAddress: this.selectedShippingAddressId, // ✔ CORRECTO
      paymentMethod: this.paymentMethodId,
      shippingCost: 0,
    } as unknown as Order;

    console.log("PAYLOAD ENVIADO:", orderPayload);


    this.orderservice.createOrder(orderPayload).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe(() => {
          this.cartSig.set(null);
          this.loading.set(false);
          this.router.navigateByUrl('/thank-you');
        });
      },
      error: (error) => {
        this.loading.set(false);
        console.log(error);
        this.errorMsg.set('Hubo un error procesando tu pedido. Intenta nuevamente.');
      }
    });
  }

  getUserId() {
    let id = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe((userId) => (id = userId ?? ''));
    return id;
  }
}
