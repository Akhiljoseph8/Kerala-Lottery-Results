import { Component } from '@angular/core';
import { Firestore, collection,getDoc,doc } from '@angular/fire/firestore';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';

declare var adsbygoogle: any;
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  
  constructor(public dataService: DataService, public firestore:Firestore, private route:ActivatedRoute ) { }
  id:any
  arraylength:any
  numbers:any
  str:any
  prizeInfo: any;
  prizeDetails:any;
  stringArrays: string[][] = [];
  lottery:any

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async paramMap => {
      const idParam = paramMap.get('id'); 
      if (idParam) {
        this.lottery= await this.dataService.fetchDocumentById(idParam)
        this.getLotteryDetails(idParam)
        this.getLotteryInfo(idParam)
      } else {
        this.id = null; 
      }
    });

    (adsbygoogle = window.adsbygoogle || []).push({});
    
}


async getLotteryDetails(id: string) {
  const docRef = doc(collection(this.firestore, 'PrizeDetails'), id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    this.prizeDetails = docSnap.data(); 
    this.stringArrays = this.prizeDetails.prize_details.map((item: string) => {
      const delimiter ='  '
      return item.split(delimiter).map(subItem => subItem.trim()).filter(subItem => subItem !== ""); 
    }).map((subArr:any) => 
      subArr.flatMap((subItem:any) => 
        /(\n|\r)/g.test(subItem) && !subItem.includes('(')
          ? subItem.replace(/(\n|\r)/g, '  ').split('  ').map((s:any) => s.trim()).filter((s:any) => s !== "")
          : subItem
      )
    );
  }    
}


async getLotteryInfo(id: string) {
  const docRef = doc(collection(this.firestore, 'PrizeInfos'), id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    this.prizeInfo = docSnap.data(); 
    if (this.prizeInfo && Array.isArray(this.prizeInfo.prize_details)) {
      this.prizeInfo.prize_details = this.prizeInfo.prize_details.filter((item: string) => item !== "nill");
      this.arraylength=this.prizeInfo.prize_details.length
    this.numbers = this.createRange(this.arraylength);
    }
  } else {
    console.log('No such document!');
  }
}


createRange(limit: number): number[] {
  return Array.from({ length: limit }, (_, index) => index);
}



}
