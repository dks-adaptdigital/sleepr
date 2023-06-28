import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly config: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  private readonly stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2022-11-15',
  });

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const intent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'gbp',
      confirm: true,
      payment_method: 'pm_card_visa',
    });

    this.notificationsService.emit('notify_email', { email: email });

    return intent;
  }
}
