import { Component, inject, signal } from '@angular/core';
import {
  IonContent,
  LoadingController,
  IonGrid,
  IonCol,
  IonRow,
  IonImg,
  IonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from '@ionic/angular';
import { Pokemon } from '../../services/pokemon';
import { IPokemon } from '../../models/pokemon.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-pokemon',
  templateUrl: './list-pokemon.page.html',
  styleUrls: ['./list-pokemon.page.scss'],
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonContent,
    IonGrid,
    IonCol,
    IonRow,
    IonImg,
    IonText,
    IonImg,
  ],
})
export class ListPokemonPage {
  private pokemonService: Pokemon = inject(Pokemon);
  private loadingController: LoadingController = inject(LoadingController);
  private router = inject(Router);

  // private cdr = inject(ChangeDetectorRef)

  // Signals
  public pokemons = signal<IPokemon[]>([]);

  ionViewWillEnter() {
    this.morePokemon();
  }

  async morePokemon(event?: InfiniteScrollCustomEvent) {
    const promisePokemons = this.pokemonService.getPokemons();
    if (promisePokemons) {
      let loading: any;

      if (!event) {
        loading = await this.loadingController.create({
          message: 'Cargando Pokémons...',
        });

        loading.present();
      }

      promisePokemons
        .then((pokemons: IPokemon[]) => {
          console.log(pokemons);
          this.pokemons.update((actuales) => actuales.concat(pokemons));
        })
        .catch((error) => {
          console.error('Error al obtener los pokémon:', error);
        })
        .finally(() => {
          loading?.dismiss();
          event?.target.complete();
        });
    } else {
      event?.target.complete();
    }
  }

  goToDetail(pokemon: IPokemon) {
    this.router.navigate(['detail-pokemon', pokemon.id]);
  }
}
