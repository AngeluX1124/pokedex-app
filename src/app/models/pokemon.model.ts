


//definimos una interfaz ya que solo vamos a definir propiedades
import {IStat} from "./stat.model";

//pokemon.model.ts: al ser modelo asegura que los datos 

export interface IPokemon {
    id: number;
    name: string;
    type1: string;
    //?: indica que es opcional(no puede existir)
    type2?: string;
    sprite: string;
    height: number;
    weight: number;
    abilities: string[];
    hidenAbility?: string;
    stats: IStat[];
    
    // objeto para trabajar con los stats
   // stats: {
        //base_stats: number;
      //  name: string;
   // }

   
   
}
