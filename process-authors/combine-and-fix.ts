const authors1 = [
  "Abrar Rahman Protyasha",
  "Aditya Pande",
  "Alberto Soragna",
  "Alejandro Hernández Cordero",
  "Amey Kulkarni",
  "Andreas Korb",
  "Anthony",
  "Arne Nordmann",
  "Audrow Nash",
  "Benjamin Hug",
  "Bi0T1N",
  "Chris Lalancette",
  "Christophe Bedard",
  "David V. Lu!!",
  "Emerson Knapp",
  "Eric Cousineau",
  "Esteve Fernandez",
  "Esther S. Weon",
  "Flobotics-robotics.com",
  "Geoffrey Biggs",
  "Greg Balke",
  "Ivan Santiago Paunovic",
  "Jacob Bandes-Storch",
  "Jacob Perron",
  "Jaron",
  "Joakim Roubert",
  "Jochen Sprickerhof",
  "Joe Speed",
  "Jorge Perez",
  "Katherine Scott",
  "Kenji Brameld",
  "Lyle Johnson",
  "Mateusz Sadowski",
  "Michael Terzer",
  "Michel Hidalgo",
  "Nathan Brooks",
  "Pablo Garrido",
  "Per Kerssens",
  "Ralph Lange",
  "Roberto Zegers R",
  "Russ",
  "Scott K Logan",
  "Shane Loretz",
  "Sid Faber",
  "Steve Macenski",
  "Steve Peters",
  "Steven! Ragnarök",
  "Taylor Alexander",
  "Tim Clephas",
  "Tomoya Fujita",
  "Tully Foote",
  "Tyler Weaver",
  "Veera Ragav",
  "Vicidel",
  "Víctor Mayoral Vilches",
  "William Woodall",
  "Youngjin Yun",
  "gerkey",
  "hodnajit",
  "jmackay2",
  "kenny_wang",
  "kurshakuz",
  "leothehuman",
  "mauropasse",
  "mergify[bot]",
  "methylDragon",
  "rcp1",
  "rob-clarke",
];

// generated with https://github.com/clalancette/ros_changelog_from_pkgs
const authors2 = `
ANDOU Tetsuo
Abrar Rahman Protyasha
Adam Dąbrowski
Aditya Pande
Afonso da Fonseca Braga
Ahmed Sobhy
Akash
Alberto Soragna
Alejandro Hernández Cordero
Amro Al-Baali
Andrea Sorbini
AndyZe
Anthony
Anthony Deschamps
Artem Shumov
Audrow Nash
Auguste Lalande
Barry Xu
Bastian Jäger
Bi0T1N
Bjar Ne
Brett Downing
Cameron Miller
Carlos Andrés Álvarez Restrepo
Charles Cross
Chen Lihui
Chris Lalancette
Christophe Bedard
Cory Crean
Daisuke Nishimatsu
David V. Lu
David V. Lu!!
Denis Štogl
Derek Chopp
Dietrich Krönke
Dima Dorezyuk
Dirk Thomas
Doug Smith
Elias De Coninck
Emerson Knapp
Erik Boasson
Erki Suurjaak
Felix Divo
Florian Vahl
Gaël Écorchard
Geoffrey Biggs
Gonzo
Greg Balke
Grey
HMellor
Hannu Henttinen
Haowei Wen
Hemal Shah
Hirokazu Ishida
Homalozoa X
Hunter L. Allen
Hye-Jong KIM
Immanuel Martini
Ingo Lütkebohle
Ivan Santiago Paunovic
Jacob Perron
Jafar Abdi
Jay Wang
Joe Speed
Jonathan Binney
Jonathan Selling
Jorge Perez
Jose Antonio Moral
Jose Luis Rivero
Joseph Schornak
Joshua Whitley
João C. Monteiro
Karsten Knese
Katherine Scott
Kaven Yau
Keisuke Shima
Kenji Brameld
Kenji Miyake
Khasreto
Khush Jain
Kosuke Takeuchi
Laszlo Turanyi
Lei Liu
Louise Poubel
M. Fatih Cırıt
M. Hofstätter
M. Mostafa Farzan
Marco Lampacrescia
Martin Günther
Martin Idel
Matt Lanting
Mauro Passerino
Michael Ferguson
Michael Jeronimo
Michael Orlov
Michal Sojka
Michel Hidalgo
Miguel Company
Nikolai Morin
Nils Schulte
Nisala Kalupahana
NoyZuberi
Octogonapus
PGotzmann
Pablo Garrido
Paul
Petter Nilsson
Piotr Jaroszek
Ralph Lange
Rebecca Butler
RoboTech Vision
Russell Joyce
Scott K Logan
Seulbae Kim
Shane Loretz
Shivam Pandey
Silvio Traversaro
Sonia Jin
Steve Macenski
Steve Nogar
Steven! Ragnarök
Sumanth Nirmal
Timo Röhling
Tomoya Fujita
Tony Peng
Tully Foote
Víctor Mayoral Vilches
WideAwakeTN
Will
William Woodall
Wojciech Jaworski
Wolf Vollprecht
Yong-Hao Zou
Zhenpeng Ge
Zongbao Feng
bailaC
brian soe
carlossvg
cturcotte-qnx
davidorchansky
dependabot[bot]
eboasson
gezp
guillaume-pais-siemens
iRobot ROS
ibnHatab
joshua-qnx
ketatam
ksuszka
livanov93
matthews-jca
mauropasse
mergify[bot]
ori155
rob-clarke
roger-strain
serge-nikulin
simulacrus
sonia
spiralray
tim-fan
tumtom
vineet131
xwnb
Øystein Sture`.split("\n").filter((l) => l.trim() !== "");

function isUpdateName(name: string): boolean {
  return name.includes("-") || name.includes("_") ||
    name.charAt(0) !== name.charAt(0).toUpperCase();
}

function combineAuthorsAndPromptForFixes() {
  const peopleSet = new Set<string>();
  authors1.forEach((a) => peopleSet.add(a));
  authors2.forEach((a) => peopleSet.add(a));
  for (const person of peopleSet) {
    if (isUpdateName(person)) {
      const parts = person.split(/-|_/);
      const updateName = parts.map((p) =>
        p.charAt(0).toUpperCase() + p.slice(1)
      ).join(" ");
      const result = prompt(`${person} -> ${updateName}? [y/n/c/d]`)
        ?.toLocaleLowerCase();
      if (result === "y") {
        peopleSet.delete(person);
        peopleSet.add(updateName);
        console.log(`${person} -> ${updateName}`);
      } else if (result === "c") {
        const customName = prompt(`Updated name? `) as string;
        peopleSet.delete(person);
        peopleSet.add(customName);
        console.log(`${person} -> ${updateName}`);
      } else if (result === "d") {
        peopleSet.delete(person);
        console.log(`${person} -> ${result as string}`);
      } else {
        console.log("Skipped");
      }
    }
  }
  const people = Array.from(peopleSet);
  console.log(people.sort().join(", "));
}

combineAuthorsAndPromptForFixes();
