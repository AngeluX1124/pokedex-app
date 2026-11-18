import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  IonContent, IonFab, IonFabButton, IonIcon, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonGrid,
  IonRow, IonCol, IonImg, IonText, IonProgressBar, IonSpinner
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

import { Pokemon } from '../../services/pokemon';
import { IPokemon } from '../../models/pokemon.model';
import { GetStatPipe } from '../../pipes/get-stat-pipe';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  imports: [
    IonContent, IonFab, IonFabButton, IonIcon, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonGrid,
    IonRow, IonCol, IonImg, IonText, IonProgressBar, IonSpinner,
    CommonModule, RouterModule, GetStatPipe
  ],
})
export class DetailPokemonPage implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(Pokemon);

  public pokemon = signal<IPokemon | null>(null);
  public loading = signal<boolean>(true);

  constructor() {
    addIcons({ close });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = parseInt(idParam, 10);
      this.pokemonService.getPokemon(id).then((data) => {
        this.pokemon.set(data);
        this.loading.set(false);
      });
    }
  }
}