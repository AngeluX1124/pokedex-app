import { Service } from '@angular/core';

import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { IPokemon } from '../models/pokemon.model';

@Service()
export class Pokemon {
  private readonly URL_BASE = 'https://pokeapi.co/api/v2/pokemon';
  private nextURL = `${this.URL_BASE}?offset=0&limit=20`;

  getPokemons() {
    if (this.nextURL) {
      const options = {
        url: this.nextURL,
        params: {},
      };

      // Petición 1: Solicito la lsta de pokemons
      return CapacitorHttp.get(options).then(async (response: HttpResponse) => {
        console.log(response);
        const pokemons: IPokemon[] = [];

        if (response.data) {
          const results = response.data.results;

          this.nextURL = response.data.next;

          // Petición 2: Solicitar por cada registro su detalle completo.
          const promises: Promise<HttpResponse>[] = [];
          for (const result of results) {
            const urlPokemon = result.url;
            const optionsPokemon = {
              url: urlPokemon,
              params: {},
            };

            promises.push(CapacitorHttp.get(optionsPokemon));
          }

          await Promise.all(promises).then((responses: HttpResponse[]) => {
            console.log(responses);
            for (const response of responses) {
              const pokemon = this.procesPokemon(response.data);
              pokemons.push(pokemon);
            }
          });
        }
        return pokemons;
      });
    }
    return null;
  }

  getPokemon(id: number) {
    const options = {
      url: `${this.URL_BASE}/${id}`,
      params: {},
    };

    return CapacitorHttp.get(options).then((response: HttpResponse) =>
      this.procesPokemon(response.data)
    );
  }

  private procesPokemon(pokemonData: any) {
    const pokemon: IPokemon = {
      id: pokemonData.id,
      name: pokemonData.name,
      type1: pokemonData.types[0].type.name,
      sprite: pokemonData.sprites.front_default,
      weight: pokemonData.weight / 10,
      height: pokemonData.height / 10,
      stats: pokemonData.stats.map((stat: any) => {
        return {
          base_stat: stat.base_stat,
          name: stat.stat.name,
        };
      }),
      abilities: pokemonData.abilities
        .filter((ability: any) => !ability.is_hidden)
        .map((ability: any) => ability.ability.name),
    };
    if (pokemonData.types[1]) {
      pokemon.type2 = pokemonData.types[1].type.name;
    }
    const hiddenAbility = pokemonData.abilities.find(
      (ability: any) => ability.is_hidden
    );
    if (hiddenAbility) {
      pokemon.hidenAbility = hiddenAbility.ability.name;
    }
    return pokemon;
  }
}
