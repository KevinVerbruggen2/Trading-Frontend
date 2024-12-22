import { Injectable } from "@angular/core";
import {Subscription} from "rxjs";
import {OnDestroy} from "@angular/core";

@Injectable()
export abstract class SubscriptionService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  protected addSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
