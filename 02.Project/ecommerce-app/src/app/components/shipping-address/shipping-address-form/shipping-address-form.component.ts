import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ShippingAddress } from '../../../core/types/shippingAddress';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { FormErrorService } from '../../../core/services/validation/form-error.service';

@Component({
  selector: 'app-shipping-address-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './shipping-address-form.component.html',
  styleUrl: './shipping-address-form.component.css',
})
export class ShippingAddressFormComponent implements OnChanges {
  @Input() address: ShippingAddress | null = null;
  @Input() isEditMode: boolean = false;
  @Output() addressSaved = new EventEmitter<ShippingAddress>();

  addressForm: FormGroup;

  private formErrorService = inject(FormErrorService);

  constructor(private fb: FormBuilder) {
    this.addressForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.address) {
      this.populateForm();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      postalCode: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(6),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      country: ['México', [Validators.required]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15),
          Validators.pattern(/^[0-9+\-\s()]+$/),
        ],
      ],
      addressType: ['home', [Validators.required]],
      isDefault: [false],
    });
  }

  private populateForm(): void {
    if (!this.address) return;

    this.addressForm.patchValue({
      name: this.address.name,
      address: this.address.address,
      city: this.address.city,
      state: this.address.state,
      postalCode: this.address.postalCode,
      country: this.address.country,
      phone: this.address.phone,
      addressType: this.address.addressType,
      isDefault: this.address.isDefault,
    });
  }

  getFieldError(fieldName: string): string {
    const customLabels = {
      name: 'Nombre completo',
      address: 'Dirección',
      city: 'Ciudad',
      state: 'Estado',
      postalCode: 'Código postal',
      country: 'País',
      phone: 'Teléfono',
      addressType: 'Tipo de dirección',
      isDefault: 'Dirección predeterminada',
    };

    return this.formErrorService.getFieldError(this.addressForm, fieldName, customLabels);
  }

  onSubmit(): void {
    if (this.addressForm.invalid) return;

    const form = this.addressForm.value;

    const formData: ShippingAddress = {
      _id: this.address?._id ?? '',
      name: form.name,
      address: form.address,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
      phone: form.phone,
      isDefault: form.isDefault,
      addressType: form.addressType,
      user: this.address?.user ?? '',
    };

    this.addressSaved.emit(formData);
  }
}
