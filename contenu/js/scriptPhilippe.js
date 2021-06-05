'use strict'

const AppPhil = {
  Date: {
    /**
     * Retourne le dimanche prédédant une date
     *
     * @param {Date} d étant un objet de type Date
     * @returns {Date} une date correspondant au premier dimanche prédédant la date fourni en paramètre
     *Ou d si c'est déjà un dimanche
     */
    obtenirDimancheDeLaSemaine: function (d) {
      var day = d.getDay()
      if (day === 0) return d
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day)
    },
    /**
     *
     *
     * @param {Date} date date de naissance
     * @returns l'âge
     */
    obtenirAge: function (date) {
      if (date > new Date()) throw new Error('Naissance dans le futur...')
      var diff = Date.now() - date.getTime()
      var age = new Date(diff)
      return Math.abs(age.getUTCFullYear() - 1970)
    },
    jours: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  },
  GenerationContenu: {
    /**
     *Génère le contenu le texte et les boutons pour les sept jours de la semaine.
     */
    genererJours: function () {
      const parent = document.getElementById('accordion')
      AppPhil.Date.jours.forEach(element => {
        const h3 = document.createElement('h3')
        parent.appendChild(h3)
        h3.id = element.toLowerCase()
        h3.innerText = element
        h3.classList.add('bg-primary', 'rounded')
        const donnees = document.createElement('div')
        parent.appendChild(donnees)
        donnees.classList.add('h4', 'journee', 'text-white', 'ml-3', 'journee-container')
      })
    },
    /**
     *Créer un bouton pour des modifications à la consommation d'une journée.
     *
     * @param {elementHtml} parent le groupe de bouton
     * @param {string} icone la partie de la classe FontAwesome à ajouter suivant fa-. Par exemple, pour la classe fa-plus
     * il faut passer 'plus'
     * @param {string} aide le texte à mettre dans le aria-label et dans le title
     * @param {string} classes les classes du boutons à ajouter (Paramètres restants).
     */
    genererBouton: function (parent, icone, aide, ...classes) {
      const bouton = document.createElement('button')
      bouton.setAttribute('aria-label', aide)
      bouton.setAttribute('title', aide)
      bouton.classList.add('btn', ...classes)
      const elemIcone = document.createElement('i')
      elemIcone.classList.add('fas', 'fa-' + icone)
      parent.appendChild(bouton)
      bouton.appendChild(elemIcone)
    },
    /**
     *Génère un graphique à l'aide de chart.js
     *
     * @param {Number[]} donnees un tableau de 7 nombres. Consommation du dimanche au samedi
     */
    genererGraphique: function (donnees) {
      const ctx = document.getElementById('canvas').getContext('2d')
      // eslint-disable-next-line no-undef
      const graphique = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: AppPhil.Date.jours,
          datasets: [{
            label: '# de consommations',
            data: donnees,
            backgroundColor: [
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
      console.log(graphique)
    }
  },
  EducAlcool: {
    obtenirRecommandations: function (sexe) {
      if (sexe === 'Homme') {
        return this.Recommandations.Homme
      }
      return this.Recommandations.Femme
    },
    Recommandations: {
      Homme: {
        MaxHebdo: 15,
        MaxQuotidien: 3
      },
      FemmeOuAutre: {
        MaxHebdo: 12,
        MaxQuotidien: 2
      }
    }
  },
  Profil: class {
    constructor(nom, age, sexe, situation, consommationHebdo) {
      // Ici, nous devrions valider que les données sont bonnes, je vais seulement vérifier l'âge.
      this.nom = nom
      if (age < 18) {
        throw new Error("Vous deviez valider l'âge...")
      }
      this.age = age
      this.sexe = sexe
      this.situation = situation
      this.consommationHebdo = consommationHebdo
    }

    respecteNormes() {
      const maxQuotidien = Math.max(...this.consommationHebdo)
      const recommandations = AppPhil.EducAlcool.obtenirRecommandations(this.sexe)
      const respectMaxQuotidien = maxQuotidien <= recommandations.MaxQuotidien
      const sommeHebdo = this.consommationHebdo.reduce((accumulateur, valeurCourante) => accumulateur + valeurCourante, 0)
      const respectMaxHebdo = sommeHebdo <= recommandations.MaxHebdo
      if (this.situation !== 'aucune_restriction') {
        if (sommeHebdo > 0) {
          return false
        }
        return true
      }
      if (respectMaxQuotidien && respectMaxHebdo) {
        return true
      }
      return false
    }
  }
}

// Cette ligne est exécutée au chargement de la page
AppPhil.GenerationContenu.genererJours()


/// Ne pas modifier ce qui est au-dessus de cette ligne///
class Consommation {
  constructor(volume, pourcentage) {
    this.volume = volume
    this.pourcentage = pourcentage
  }
}

const donnees = {
  consommation: [
    [
      new Consommation(355, 0.04), new Consommation(355, 0.08)
    ],
    [],
    [
      new Consommation(100, 0.20)
    ],
    [],
    [],
    [
      new Consommation(355, 0.04), new Consommation(355, 0.08)
    ],
    [
      new Consommation(355, 0.04), new Consommation(355, 0.08)
    ]
  ]
}
const donneesTexte = JSON.stringify(donnees)

// code fonctionnel, mais ayant beaucoup de problèmes
// Revue de code commentaires constructifs
// 1) Les variable let devrais être des const, car elle ne sont jamais réassigner a une nouvelle valeur.
// 2) Le paramètre a qu'elle recoit, pourrais avoir un nom qui explique mieux ce qu'elle est, car "a" ne veut pas dire grand chose.
// Elle pourrait simplement s'appeller "donneesTexte". Ou encore a la ligne 213 la variable 'pour' peut porter a confusion, elle
// pourrait s'appeller 'pourcentage'.
// 3) Il aurait pus avoir l'utilisation de Jquery.
// ----------------------------Code original--------------------------------------------------
// function ChargerDonnees(a) {
//   let donneesJSON = JSON.parse(a)
//   console.log(donneesJSON)
//   for (let i = 1; i <= donneesJSON.consommation.length; i++) {
//     let tab = document.createElement('table')
//     tab.classList.add('bg-secondary', 'table')
//     const tableauConsoQuotidien = donneesJSON.consommation[i - 1];
//     for (let j = 0; j < tableauConsoQuotidien.length; j++) {
//       let divJours = document.getElementsByClassName('journee-container')[i - 1]
//       let row = document.createElement('tr')
//       let volume = document.createElement('td')
//       volume.innerText = tableauConsoQuotidien[j].volume
//       row.appendChild(volume)
//       let pour = document.createElement('td')
//       pour.innerText = tableauConsoQuotidien[j].pourcentage
//       row.appendChild(pour)
//       let consoEducAlcool = document.createElement('td')
//       consoEducAlcool.innerText = (tableauConsoQuotidien[j].volume * tableauConsoQuotidien[j].pourcentage / 20).toFixed(2)
//       row.appendChild(consoEducAlcool)
//       tab.appendChild(row)
//       divJours.appendChild(tab)
//     }
//   }
// }

// utilisation de jQuery.
function ChargerDonnees(a) {
  let donneesJSON = JSON.parse(a)
  console.log(donneesJSON)
  for (let i = 1; i <= donneesJSON.consommation.length; i++) {
    let tab = document.createElement('table')
    tab.classList.add('bg-secondary', 'table')
    const tableauConsoQuotidien = $(donneesJSON.consommation[i - 1]).get()
    for (let j = 0; j < tableauConsoQuotidien.length; j++) {
      let divJours = document.getElementsByClassName('journee-container')[i - 1]
      let row = document.createElement('tr')
      let volume = document.createElement('td')
      volume.innerText = tableauConsoQuotidien[j].volume
      row.appendChild(volume)
      let pour = document.createElement('td')
      pour.innerText = tableauConsoQuotidien[j].pourcentage
      row.appendChild(pour)
      let consoEducAlcool = document.createElement('td')
      consoEducAlcool.innerText = (tableauConsoQuotidien[j].volume * tableauConsoQuotidien[j].pourcentage / 20).toFixed(2)
      row.appendChild(consoEducAlcool)
      tab.appendChild(row)
      $(divJours).append(tab)
    }
  }
}

const saveDonnees = {
  sauvegarderDonnées () {
    console.log('Les données ont été sauvegardées : ' + Date())
  }
}

// Appelle la function quand le dom est ready.
$(document).ready(ChargerDonnees(donneesTexte))
