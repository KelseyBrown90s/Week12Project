class Animalcrossingvillage{
    constructor(name){
        this.name=name;
        this.characters=[];

    }
    addCharacter(hobby,personality){
        this.characters.push(new Character(hobby,personality));
    }
}
class Character{
constructor(hobby,personality){
        this.hobby=hobby;
        this.personality=personality;
        
           
}
}
class AnimalcrossingvillageService{
    static url='https://640803858ee73db92e36608e.mockapi.io/Animalcrossingvillages';

    static getAllAnimalcrossingvillages(){
        return $.get(this.url);
    }

  static getAnimalcrossingvillage(id){
        return $.get(this.url + `/${id}`);

    }
    
   static createAnimalcrossingvillage(animalcrossingvillage){
        return $.post(this.url , animalcrossingvillage);

   } 
   static updateAnimalcrossingvillage(animalcrossingvillage){
        return $.ajax({
            url: this.url + `/${animalcrossingvillage._id}`,
            dataType:'json',
            data: JSON.stringify(animalcrossingvillage),
            contentType:'application/json',
            type: 'PUT'

        });
   }

   static deleteAnimalcrossingvillage(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type:'DELETE'
        });
   }

}

class DOMManager{
    static animalcrossingvillages;

    static getAllanimalcrossingvillages(){
        AnimalcrossingvillageService.getAllAnimalcrossingvillages().then(animalcrossingvillages => this.render(animalcrossingvillages));

    }

    static createAnimalcrossingvillage(name){
        AnimalcrossingvillageService.createAnimalcrossingvillage(new Animalcrossingvillage(name))
        .then(() =>{
            return AnimalcrossingvillageService.getAllAnimalcrossingvillages();
        })
        .then((animalcrossingvillages)=> this.render(animalcrossingvillages));
    } 

    static deleteAnimalcrossingvillage(id){
        AnimalcrossingvillageService.deleteAnimalcrossingvillage(id)
        .then(() =>{
            return AnimalcrossingvillageService.getAllAnimalcrossingvillages();
        })
        .then((animalcrossingvillages)=> this.render(animalcrossingvillages));
    }

    static addCharacter(id){
        for(let animalcrossingvillage of this.animalcrossingvillages){
            if(animalcrossingvillage._id == id){
                animalcrossingvillage.characters.push(new Character($(`#${animalcrossingvillage._id}-character-hobby`).val(),$(`#${animalcrossingvillage._id}-character-personality`).val()));
                AnimalcrossingvillageService.updateAnimalcrossingvillage(animalcrossingvillage)
                    .then(()=>{
                        return AnimalcrossingvillageService.getAllanimalcrossingvillages();
                    })
                    .then((animalcrossingvillages) => this.render(animalcrossingvillages));
            }
        }
    }

    static deleteCharacter(animalcrossingvillageId,characterId){
        for(let animalcrossingvillage of this.animalcrossingvillages){
            if(animalcrossingvillage._id == animalcrossingvillageId){
                for(let character of animalcrossingvillage.characters){
                    if(character._id == characterId){
                        animalcrossingvillage.characters.splice(animalcrossingvillage.characters.indexOf(character),1);
                        AnimalcrossingvillageService.updateAnimalcrossingvillage(animalcrossingvillage)
                        .then(() =>{
                            return AnimalcrossingvillageService.getAllAnimalcrossingvillages();
                        })
                        .then((animalcrossingvillages) => this.render(animalcrossingvillages));
                    }
                }
            }
        }
    }

    static render(animalcrossingvillages){
        this.animalcrossingvillages= animalcrossingvillages;
        $('#app').empty();
        for(let animalcrossingvillage of animalcrossingvillages){
            $('#app').prepend(
                `<div id ="${animalcrossingvillage._id}" class="card">
                  <div class= "card-header">
                   <h2>${animalcrossingvillage.name}</h2>,
                     <button class="btn btn-danger onclick="DOMManager.deleteAnimalcrossingvillage('${animalcrossingvillage._id}')">Delete</button>
                    </div>
                    <div class="card-body" placeholder="Village Name">
                         <div class="card">
                             <div class="row">
                                 <div class="col-sm">
                                    <input type="text" id="${animalcrossingvillage._id}-character-hobby" class="form-control" placeholder="Character Hobby"> 
                            </div>
                                <div class="col-sm">
                                    <input type="text" id="${animalcrossingvillage._id}-character-personality" class="form-control" placeholder="Character Personality"> 
                            </div>
                         </div>
                        <button id="${animalcrossingvillage._id}-new-character" onclick="DOMManager.addCharacter('${animalcrossingvillage._id}')" class="btn btn-primary form-control ">Add</button> 
                    </div>
                </div>
             </div><br> `
            );
            for(let character of animalcrossingvillage.characters){
                $(`#${animalcrossingvillage._id}`).find('.card-body').append(
                    `<p>
                     <span id="name-${character.id}"><strong>hobby: </strong> ${character.hobby} </span>
                     <span id="personality-${character.id}"><strong>personality: </strong> ${character.personality} </span>
                     <button class="btn btn-danger" onclick="DOMManager.deleteCharacter('${animalcrossingvillage.id}', '${character.id}')">Delete Character </button>`
                    

                );
            }
        }
    }
}
$(`#create-new-animalcrossingvillage`).click(()=>{
  DOMManager.createAnimalcrossingvillage($(`#new-animalcrossingvillage-name`).val());
  $(`#newanimalcrossingvillage-name`).val('');
});

DOMManager.getAllanimalcrossingvillages();