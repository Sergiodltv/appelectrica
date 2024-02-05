import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { PriceTime } from 'src/app/models/price-time.model';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ShowApplianceComponent } from '../show-appliance/show-appliance.component';

@Component({
  selector: 'app-select-appliance',
  templateUrl: './select-appliance.component.html',
  styleUrls: ['./select-appliance.component.scss'],
})
export class SelectApplianceComponent implements OnInit {

  apiService = inject(ApiService);

  prices: any;
  priceTime: PriceTime[] = [];

  lavavajillasHour: string = "-1";
  lavadoraHour: string = "-1";
  secadoraHour: string = "-1";
  planchaHour: string = "-1";
  cocheHour: string = "-1";

  coche: boolean;
  maxHour: boolean;

  respuestas1 = ["0 horas", "1 hora", "2 horas", "3 horas"];
  respuestas2 = ["0 horas", "1 hora", "2 horas", "3 horas", "4 horas",
    "5 horas", "6 horas", "7 horas", "8 horas", "9 horas", "10 horas"];

  form1 = new FormGroup({
    lavavajillas: new FormControl('', Validators.required),
    lavadora: new FormControl('', Validators.required),
    secadora: new FormControl('', Validators.required),
    plancha: new FormControl('', Validators.required)
  })

  form2 = new FormGroup({
    coche: new FormControl('', Validators.required)
  })

  constructor(navParams: NavParams, private utilsService: UtilsService) {
    this.coche = navParams.get('coche');
  }

  ngOnInit() {
    this.apiService.getPrices().subscribe(
      (res) => {
        this.prices = res;

        console.log(res);

        this.prices.indicator.values.forEach(x => {
          this.priceTime.push({
            time: x.datetime.substring(11, 13),
            value: +((+x.value) / 1000).toFixed(5)
          })
        });
      }
    )
  }

  async onClick() {
    let hour = new Date().getHours().toString();
    if (hour.length == 1) {
      hour = `0${hour}`;
    }
    const priceTimeFilter = this.priceTime.filter(x => +x.time >= +hour);

    if (!this.coche) {
      let lavavajillas = +this.form1.value.lavavajillas.substring(0, 1);
      let lavadora = +this.form1.value.lavadora.substring(0, 1);
      let secadora = +this.form1.value.secadora.substring(0, 1);
      let plancha = +this.form1.value.plancha.substring(0, 1);
      let total = lavavajillas + lavadora + secadora + plancha;

      if (total > priceTimeFilter.length) {
        this.maxHour = true;
      }
      else {
        this.maxHour = false;
        if (plancha > 0) {
          let minValue = 0;
          let minPos = 0;
          for (let i = 0; i < priceTimeFilter.length - plancha; i++) {
            let mean = 0;
            for (let j = i; j < i + plancha; j++) {
              mean += priceTimeFilter[j].value;
            }
            mean = mean / plancha;
            if (i == 0 || mean <= minValue) {
              minValue = mean;
              minPos = i;
            }
          }

          this.planchaHour = priceTimeFilter[minPos].time;
        }

        if (lavavajillas > 0) {
          let minValue = 0;
          let minPos = 0;
          for (let i = 0; i < priceTimeFilter.length - lavavajillas; i++) {
            let mean = 0;
            for (let j = i; j < i + lavavajillas; j++) {
              mean += priceTimeFilter[j].value;
            }
            mean = mean / lavavajillas;
            if (i == 0 || mean <= minValue) {
              minValue = mean;
              minPos = i;
            }
          }

          this.lavavajillasHour = priceTimeFilter[minPos].time;
        }


        if (lavadora > 0) {
          let minValue = 0;
          let minPos = 0;
          for (let i = 0; i < priceTimeFilter.length - lavadora; i++) {
            let mean = 0;
            for (let j = i; j < i + lavadora; j++) {
              mean += priceTimeFilter[j].value;
            }
            mean = mean / lavadora;
            if ((i == 0 || mean <= minValue)) {
              minValue = mean;
              minPos = i;
            }
          }

          this.lavadoraHour = priceTimeFilter[minPos].time;

          priceTimeFilter.splice(minPos, lavadora);
        }

        if (secadora > 0) {
          let minValue = 0;
          let minPos = 0;
          for (let i = 0; i < priceTimeFilter.length - secadora; i++) {
            let continuo = true;
            let mean = 0;
            for (let j = i; j < i + secadora; j++) {
              mean += priceTimeFilter[j].value;
              if(j != i && priceTimeFilter[j-1].time + 1 != (priceTimeFilter[j].time)){
                continuo = false;
              }
            }
            mean = mean / secadora;
            if ((i == 0 || mean <= minValue) && continuo) {
              minValue = mean;
              minPos = i;
            }
          }

          this.secadoraHour = priceTimeFilter[minPos].time;
        }
      }

      await this.utilsService.presentModal({
        component: ShowApplianceComponent,
        cssClass: 'modal',
        componentProps: {
          'hayCoche': this.coche,
          'maxHour': this.maxHour,
          'lavavajillas': this.lavavajillasHour,
          'lavadora': this.lavadoraHour,
          'secadora': this.secadoraHour,
          'plancha': this.planchaHour
        }
      })

    } else {
      let coche = +this.form2.value.coche.substring(0, 1);
      if (coche > 0) {
        let minValue = 0;
        let minPos = 0;
        for (let i = 0; i < priceTimeFilter.length - coche; i++) {
          let mean = 0;
          for (let j = i; j < i + coche; j++) {
            mean += priceTimeFilter[j].value;
          }
          mean = mean / coche;
          if (i == 0 || mean <= minValue) {
            minValue = mean;
            minPos = i;
          }
        }

        this.cocheHour = priceTimeFilter[minPos].time;
      }

      await this.utilsService.presentModal({
        component: ShowApplianceComponent,
        cssClass: 'modal',
        componentProps: {
          'hayCoche': this.coche,
          'coche': this.cocheHour
        }
      })
    }
  }

}