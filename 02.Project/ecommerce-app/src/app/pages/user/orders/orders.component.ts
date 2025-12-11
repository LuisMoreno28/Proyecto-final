import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order/order.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../core/store/auth/auth.selectors';
import { take } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.select(selectUserId)
      .pipe(take(1))
      .subscribe((userId) => {
        if (userId) {
          this.orderService.getOrdersByUserId(userId).subscribe({
            next: (orders) => {
              this.orders = orders;
              this.loading = false;
            },
            error: () => this.loading = false
          });
        }
      });
  }
}
