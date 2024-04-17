// utils.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  public timeSinceInvoice(invoiceDate: string): string {
    if (invoiceDate === 'Pending') {
      return invoiceDate;
    }

    const parts = invoiceDate.split(' ');
    let dateTimeString = '';

    // Check if the input contains "Sent to AP at"
    if (parts.includes('Sent')) {
      // Extract the date and time from the input
      const dateTimeIndex = parts.indexOf('at') + 1;
      dateTimeString = parts.slice(dateTimeIndex).join(' ');
    } else {
      // Assume the input is just the date
      dateTimeString = invoiceDate;
    }

    const invoiceDateTime = new Date(dateTimeString);
    const currentDateTime = new Date();
    const timeDiff = currentDateTime.getTime() - invoiceDateTime.getTime();

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`;
  }
}
