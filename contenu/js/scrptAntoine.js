'use strict'
document.addEventListener('DOMContentLoaded', function (event) {
  // Appelle la fonction pour afficher la progress bar.
  AfficherProgressBar()

  // Appelle la fonction une première fois pour afficher
  // les bonnes couleur de fond et de mettre a jours la
  // Progress bar
  BGCouleurConsomation()
})

// Lorsque le bouton générer rapport (sont id est 'lancer') est clciker.
document.getElementById('lancer').addEventListener('click', function () {
  // Création de l'élément image.
  // Image loading de type gif.
  const image = document.createElement('img')
  // Chemin d'accèes
  image.src = 'contenu/img/chargement.gif'
  // Style
  image.style.width = '100%'
  // Ajoue de l'id 'imageLoading' a l'image.
  image.id = 'imageLoading'

  // Récuppération de l'élément avec l'id 'rapport'.
  const parent = document.getElementById('rapport')

  // Supprime le premier message créé si il est présent pour éviter
  // les doublons.
  if (parent.childElementCount > 0) {
    parent.childNodes[1].remove()
  }

  // Ajoue de l'image au parent.
  parent.appendChild(image)

  // Supprime l'image après 2 secondes et affiche un message pour
  // dire que la génération est terminée.
  setTimeout(function () {
    document.getElementById('imageLoading').remove()
    const pChargementFini = document.createElement('p')
    pChargementFini.textContent = 'Génération Terminée'
    pChargementFini.style.fontSize = '2rem'
    pChargementFini.align = 'center'

    // Ajoute le paragraphe 'pChargementFini' au parent.
    parent.appendChild(pChargementFini)
  }, 2000)
})

// Appelle sauvegarderDonnées du scriptPhilippe.js tout les 30 sec.
setInterval(saveDonnees.sauvegarderDonnées, 30000)

// appelle BGCouleurConsomation tout les 30sec pour modifier la progress bar
// et changer la couleur de fond des consomation
setInterval(BGCouleurConsomation, 30000)

// Cette function Ajoute une progress bar dans le haut de la page,
// cette progress bar représente l'avancer des consomations de la
// semaine elle atteind 100% a 15 consomation.
function AfficherProgressBar () {
  // Création du div parent qui contien la progress bar.
  const divParent = document.createElement('div')
  divParent.id = 'progress'

  // Affiche la progress bar a la bonne endroit.
  const form = document.getElementById('section_hebdo').parentNode
  form.insertBefore(divParent, form.firstChild)
}

// Cette consomation récupère le nombre de consomation et change la couleur de fond
// de la consomation en fonction de sont nombre. Soit vert, jaune ou rouge. Elle
// appelle ModiffierProgressBar et lui passent en paramètre le nombre de consomations
function BGCouleurConsomation () {
  const accordion = document.getElementById('accordion')

  // Nombre de consomation.
  let nbConsomationsSemaine = 0
  for (let i = 0; i <= 14; i += 2) {
    if (accordion.childNodes[i].firstChild != null) {
      const table = accordion.childNodes[i].firstChild

      // Le nombre de consomation de la journee, utilile pour la boucle for.
      const nbConsomation = table.childElementCount

      for (let j = 0; j < nbConsomation; j++) {
        const laConsomation = table.childNodes[j]
        nbConsomationsSemaine += parseFloat(laConsomation.childNodes[2].innerHTML)
        // Nombre de consomation de la journee.
        let nbConsomationsJour = parseFloat(laConsomation.childNodes[2].innerHTML)

        // Modiffier couleur de la journee avec jQuery.
        if (nbConsomationsJour < 2) {
          // vert #32CD32
          $(laConsomation).removeClass()
          $(laConsomation).addClass('BGvert')
        } else if (nbConsomationsJour >= 2 && nbConsomationsJour <= 3) {
          // jaune #FFFF00
          $(laConsomation).removeClass()
          $(laConsomation).addClass('BGjaune')
        } else if (nbConsomationsJour > 3) {
          // rouge #FF0000
          $(laConsomation).removeClass()
          $(laConsomation).addClass('BGrouge')
        }
        nbConsomationsJour = 0
      }
    }
  }

  ModiffierProgressBar(nbConsomationsSemaine)
}

// Cette function mets a jours la progress bar, elle recoit en paramètre
// le nombre de consomations de la semaine.
function ModiffierProgressBar (nbConsomationsSemaine) {
  // Trouver le pourcentage de la progress bar.
  const purcentageProgressBar = ((100 * nbConsomationsSemaine) / 15)

  $(function () {
    $('#progress').progressbar({
      value: Math.round(purcentageProgressBar)
    })
  })
}

// Soccupe d'afficher l'accordion de la bonne facon.
$(document).ready(function () {
  $('#accordion').accordion()
})
