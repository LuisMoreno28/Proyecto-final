import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import {
  ShippingAddress,
  ShippingAddressArraySchema,
  CreateShippingAddress,
  UpdateShippingAddress,
} from '../../types/shippingAddress';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShippingAddressService {
  private baseUrl = `${environment.BACK_URL}/shipping-address`;
  private addressSubject = new BehaviorSubject<ShippingAddress[]>([]);
  private readonly addresses$ = this.addressSubject.asObservable();

  constructor(private http: HttpClient, private store: Store) {}

  getUserId(): string {
    let userId = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe({ next: (id) => (userId = id ?? '') });
    return userId;
  }

  /**
   * Obtener todas las direcciones del usuario
   */
  getShippingAddressesByUser(userId: string): Observable<ShippingAddress[]> {
    return this.http
      .get(`${this.baseUrl}/user/${userId}`)
      .pipe(
        map((data:any) => {
          const parsed = ShippingAddressArraySchema.safeParse(data.addresses);
          if (!parsed.success) {
            console.error(parsed.error);
            return [];
          }
          return parsed.data;
        })
      );
  }

  /**
   * Crear una nueva dirección
   */
  createShippingAddress(
    data: CreateShippingAddress
  ): Observable<ShippingAddress[]> {
    const user = this.getUserId();
    const payload = {
      user,
      ...data,
    };

    return this.http.post(this.baseUrl, payload).pipe(
      switchMap(() => this.getShippingAddressesByUser(user)),
      tap((updated) => {
        this.addressSubject.next(updated);
      })
    );
  }

  /**
   * Actualizar una dirección existente
   */
  updateShippingAddress(
    updatedData: UpdateShippingAddress
  ): Observable<ShippingAddress[]> {
    const userId = this.getUserId();

    return this.http
      .put(`${this.baseUrl}/${updatedData._id}`, updatedData)
      .pipe(
        switchMap(() => this.getShippingAddressesByUser(userId)),
        tap((updated) => {
          this.addressSubject.next(updated);
        })
      );
  }

  /**
   * Cambiar la dirección por defecto
   */
  setDefaultAddress(addressId: string): Observable<ShippingAddress[]> {
    const userId = this.getUserId();
    return this.http
      .patch(`${this.baseUrl}/${addressId}/default`, {})
      .pipe(
        switchMap(() => this.getShippingAddressesByUser(userId)),
        tap((updated) => {
          this.addressSubject.next(updated);
        })
      );
  }

  /**
   * Eliminar una dirección
   */
  deleteShippingAddress(addressId: string): Observable<ShippingAddress[]> {
    const userId = this.getUserId();

    return this.http.delete(`${this.baseUrl}/${addressId}`).pipe(
      switchMap(() => this.getShippingAddressesByUser(userId)),
      tap((updated) => {
        this.addressSubject.next(updated);
      })
    );
  }
}
