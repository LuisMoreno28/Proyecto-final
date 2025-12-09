import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingAddressService } from '../../../core/services/shippingAddress/shipping-address.service';
import {
  ShippingAddress,
  CreateShippingAddress
} from '../../../core/types/shippingAddress';
import { ShippingAddressFormComponent } from '../../../components/shipping-address/shipping-address-form/shipping-address-form.component';

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [CommonModule, ShippingAddressFormComponent],
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.css'
})
export class ShippingAddressComponent implements OnInit {

  addresses: ShippingAddress[] = [];
  showForm = false;
  selectedAddress: ShippingAddress | null = null;
  isEditMode = false;

  constructor(private shippingService: ShippingAddressService) {}

  ngOnInit(): void {
    this.loadUserAddresses();
  }

  /**
   * Cargar direcciones del usuario
   */
  loadUserAddresses(): void {
    const userId = this.shippingService.getUserId();

    this.shippingService.getShippingAddressesByUser(userId).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
      },
      error: (err) => console.error('Error loading shipping addresses:', err)
    });
  }

  /**
   * Crear nueva dirección
   */
  createNewAddress(): void {
    this.selectedAddress = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  /**
   * Editar dirección existente
   */
  editAddress(address: ShippingAddress): void {
    this.selectedAddress = address;
    this.isEditMode = true;
    this.showForm = true;
  }

  /**
   * Recibir datos del formulario (crear / actualizar)
   */
  handleFormSubmit(data: ShippingAddress): void {
    if (this.isEditMode) {
      // MODO EDICIÓN
      this.shippingService.updateShippingAddress(data).subscribe({
        next: (addresses) => {
          this.addresses = addresses;
          this.showForm = false;
        },
        error: (err) => console.error('Error updating address:', err)
      });

    } else {
      // MODO CREACIÓN
      this.shippingService
        .createShippingAddress(data as CreateShippingAddress)
        .subscribe({
          next: (addresses) => {
            this.addresses = addresses;
            this.showForm = false;
          },
          error: (err) => console.error('Error creating address:', err)
        });
    }
  }

  /**
   * Marcar una dirección como predeterminada
   */
  setAsDefault(addressId: string): void {
    this.shippingService.setDefaultAddress(addressId).subscribe({
      next: (addresses) => {
        // Si el backend responde con la lista actualizada:
        if (Array.isArray(addresses)) {
          this.addresses = addresses;
        } else {
          this.loadUserAddresses();
        }
      },
      error: (err) => console.error('Error al marcar dirección por defecto:', err)
    });
  }
}
