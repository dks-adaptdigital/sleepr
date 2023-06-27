import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateChargeDto } from '@app/common/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly config: ConfigService) {}

  private readonly stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2022-11-15',
  });

  async createCharge({ amount }: CreateChargeDto) {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'gbp',
      confirm: true,
      payment_method: 'pm_card_visa',
    });
  }
}
