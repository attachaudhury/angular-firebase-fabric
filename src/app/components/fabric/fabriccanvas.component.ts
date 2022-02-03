import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { fabric } from 'fabric';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-fabriccanvas',
  templateUrl: './fabriccanvas.component.html',
  styleUrls: ['./fabriccanvas.component.scss'],
})
export class FabricCanvasComponent implements AfterViewInit, OnDestroy {
  signedInUser = this.authService.getUser();
  canvas!: fabric.Canvas;
  savedCanvas!: string;
  dbCanvasRef!: AngularFireObject<any>;
  dbCanvas!: any;
  user!: firebase.default.User | null;
  subscriptions: any[] = [];
  canvasId!: string;
  color = '#FF0000';

  constructor(
    public authService: AuthService,
    public afDb: AngularFireDatabase,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    const subscription = this.authService
      .getUser()
      .subscribe((res) => (this.user = res));
    this.subscriptions.push(subscription);

    const routeSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.canvasId = params.id;
        this.dbCanvasRef = this.afDb.object(this.canvasId);
        this.dbCanvas = this.dbCanvasRef.valueChanges();

        this.restoreCanvas();
      }
    );

    this.subscriptions.push(routeSubscription);
  }

  //angular lifecycle hooks
  ngAfterViewInit() {
    this.canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true,
      width: document.documentElement.clientWidth - 100,
      height: document.documentElement.clientHeight,
    });
    this.canvas.on('mouse:up', (e) => this.saveCanvas());
    this.canvas.on('mouse:down:before', (e) => {
      if(e.target?.type == 'image' || e.target?.type == 'path') {
        this.canvas.isDrawingMode = false;
      }
      else{
        this.canvas.isDrawingMode = true;
      }
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  // canvas funntions
  saveCanvas() {
    this.dbCanvasRef.update({
      canvas: JSON.stringify(this.canvas.toJSON()),
      color: this.color,
      email: this.user?.email,
    });
  }
  restoreCanvas() {
    const subscription = this.dbCanvas.subscribe((res: any) => {
      if (!res) {
        this.saveCanvas();
        return;
      }

      this.color = res.color;

      this.canvas.loadFromJSON(
        JSON.parse(res.canvas),
        this.canvas.renderAll.bind(this.canvas)
      );

      this.changeColor();
    });

    this.subscriptions.push(subscription);
  }

  // canvas Controls handlers
  clearCanvas() {
    this.canvas.clear();
    this.saveCanvas();
  }
  changeColor() {
    this.canvas.freeDrawingBrush.color = this.color;
  }
  imageInputChanges(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file: File = input.files[0];
    const reader = new FileReader();

    reader.onload = (ev) => {
      if (typeof reader.result !== 'string') return;

      fabric.Image.fromURL(reader.result, (img) => {
        this.canvas.add(img);
        this.canvas.centerObject(img);
        this.saveCanvas();
      });
    };

    reader.readAsDataURL(file);
  }

  //other functoins
  signout() {
    this.authService.signout();
  }
}
