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
})
export class FabricCanvasComponent implements AfterViewInit, OnDestroy {
  signedInUser = this.authService.getUser();
  canvas!: fabric.Canvas;
  savedCanvas!: string;
  dbCanvasRef!: AngularFireObject<any>;
  dbCanvas!: any;
  user!: firebase.default.User | null;
  userSubscription: any;
  routeSubscription: any;
  canvasSubscription: any;
  userId!: string;
  color = '#FF0000';

  constructor(
    public authService: AuthService,
    public aFdB: AngularFireDatabase,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.userSubscription = this.authService
      .getUser()
      .subscribe((res) => (this.user = res));

    this.routeSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.userId = params.id;
        this.dbCanvasRef = this.aFdB.object(this.userId);
        this.dbCanvas = this.dbCanvasRef.valueChanges();
        this.restoreCanvas();
      }
    );

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
    this.userSubscription.unsubscribe()
    this.routeSubscription.unsubscribe()
    this.canvasSubscription.unsubscribe()
  }

  // canvas functions
  saveCanvas() {
    this.dbCanvasRef.update({
      canvas: JSON.stringify(this.canvas.toJSON()),
      email: this.user?.email,
    });
  }
  restoreCanvas() {
    this.canvasSubscription = this.dbCanvas.subscribe((res: any) => {
      if (!res) {
        this.saveCanvas();
        return;
      }
      this.canvas.loadFromJSON(
        JSON.parse(res.canvas),
        this.canvas.renderAll.bind(this.canvas)
      );
      this.changeColor();
    });

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
