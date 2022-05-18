/* Command in Git
 * git log --pretty=format:"%ad %an" --date=short
 */

const text = `
2022-05-18 Esther S. Weon
2022-05-16 Ivan Santiago Paunovic
2022-05-16 Chris Lalancette
2022-05-16 Andreas Korb
2022-05-14 Scott K Logan
2022-05-13 Shane Loretz
2022-05-13 Shane Loretz
2022-05-13 Shane Loretz
2022-05-13 Shane Loretz
2022-05-13 Alejandro Hernández Cordero
2022-05-13 Shane Loretz
2022-05-12 Chris Lalancette
2022-05-12 Chris Lalancette
2022-05-12 Chris Lalancette
2022-05-12 Chris Lalancette
2022-05-12 Chris Lalancette
2022-05-12 Chris Lalancette
2022-05-12 Steve Macenski
2022-05-12 Ivan Santiago Paunovic
2022-05-12 Chris Lalancette
2022-05-12 Chris Lalancette
2022-05-12 mergify[bot]
2022-05-12 Chris Lalancette
2022-05-12 Geoffrey Biggs
2022-05-11 Chris Lalancette
2022-05-11 Ivan Santiago Paunovic
2022-05-11 Jacob Perron
2022-05-10 Tully Foote
2022-05-09 William Woodall
2022-05-09 Shane Loretz
2022-05-03 Esther S. Weon
2022-05-03 Chris Lalancette
2022-05-02 Tomoya Fujita
2022-05-02 Tomoya Fujita
2022-04-27 Alberto Soragna
2022-04-26 Chris Lalancette
2022-04-25 Chris Lalancette
2022-04-25 Chris Lalancette
2022-04-25 Ralph Lange
2022-04-25 Shane Loretz
2022-04-25 Chris Lalancette
2022-04-24 mergify[bot]
2022-04-22 Chris Lalancette
2022-04-22 Jaron
2022-04-21 Chris Lalancette
2022-04-21 Chris Lalancette
2022-04-20 Ivan Santiago Paunovic
2022-04-20 Shane Loretz
2022-04-18 kurshakuz
2022-04-12 Chris Lalancette
2022-04-11 Chris Lalancette
2022-04-08 Chris Lalancette
2022-04-07 mergify[bot]
2022-04-07 mergify[bot]
2022-04-06 Chris Lalancette
2022-04-06 methylDragon
2022-04-01 Chris Lalancette
2022-03-29 Shane Loretz
2022-03-28 Russ
2022-03-24 Katherine Scott
2022-03-24 mergify[bot]
2022-03-22 Roberto Zegers R
2022-03-22 Tomoya Fujita
2022-03-22 mergify[bot]
2022-03-22 Alejandro Hernández Cordero
2022-03-22 mergify[bot]
2022-03-18 Kenji Brameld
2022-03-15 Chris Lalancette
2022-03-15 Shane Loretz
2022-03-11 Aditya Pande
2022-03-08 Taylor Alexander
2022-03-01 Jacob Perron
2022-03-01 Eric Cousineau
2022-02-28 Taylor Alexander
2022-02-22 Ralph Lange
2022-02-22 hodnajit
2022-02-20 Geoffrey Biggs
2022-02-18 mergify[bot]
2022-02-18 mergify[bot]
2022-02-17 Chris Lalancette
2022-02-17 mergify[bot]
2022-02-14 Steven! Ragnarök
2022-02-12 Tomoya Fujita
2022-02-09 Abrar Rahman Protyasha
2022-02-08 Tully Foote
2022-02-08 mergify[bot]
2022-02-08 Esteve Fernandez
2022-02-08 Geoffrey Biggs
2022-02-07 Jacob Perron
2022-02-07 Jacob Perron
2022-02-05 mergify[bot]
2022-02-02 Tomoya Fujita
2022-02-01 Katherine Scott
2022-02-01 Audrow Nash
2022-01-28 mergify[bot]
2022-01-27 Chris Lalancette
2022-01-27 Jorge Perez
2022-01-27 kurshakuz
2022-01-26 Chris Lalancette
2022-01-25 Chris Lalancette
2022-01-25 mergify[bot]
2022-01-21 mergify[bot]
2022-01-19 Chris Lalancette
2022-01-18 rcp1
2022-01-13 Youngjin Yun
2022-01-07 Audrow Nash
2022-01-07 Chris Lalancette
2022-01-06 Audrow Nash
2022-01-06 Chris Lalancette
2022-01-06 Chris Lalancette
2022-01-05 Tomoya Fujita
2022-01-04 Chris Lalancette
2022-01-04 mergify[bot]
2022-01-04 leothehuman
2022-01-04 leothehuman
2022-01-03 mergify[bot]
2021-12-23 mergify[bot]
2021-12-22 Audrow Nash
2021-12-22 Benjamin Hug
2021-12-22 Youngjin Yun
2021-12-15 mergify[bot]
2021-12-14 Benjamin Hug
2021-12-10 Katherine Scott
2021-12-06 Michel Hidalgo
2021-11-16 Chris Lalancette
2021-11-16 Chris Lalancette
2021-12-01 Tim Clephas
2021-12-01 Per Kerssens
2021-11-30 kurshakuz
2021-11-29 mauropasse
2021-11-29 Katherine Scott
2021-11-29 Katherine Scott
2021-11-29 Ralph Lange
2021-11-25 Ralph Lange
2021-11-25 Vicidel
2021-11-24 Christophe Bedard
2021-11-22 Christophe Bedard
2021-11-18 Veera Ragav
2021-11-18 Jacob Perron
2021-11-15 Christophe Bedard
2021-11-12 jmackay2
2021-11-11 Katherine Scott
2021-11-11 Christophe Bedard
2021-11-11 Chris Lalancette
2021-11-11 kurshakuz
2021-11-11 Geoffrey Biggs
2021-11-05 Steven! Ragnarök
2021-11-05 mergify[bot]
2021-11-04 Abrar Rahman Protyasha
2021-11-04 mergify[bot]
2021-11-03 Bi0T1N
2021-11-02 Tully Foote
2021-11-02 mergify[bot]
2021-11-01 kurshakuz
2021-10-28 Mateusz Sadowski
2021-10-28 Anthony
2021-10-26 Amey Kulkarni
2021-10-26 kurshakuz
2021-10-26 kurshakuz
2021-10-26 kurshakuz
2021-10-26 Abrar Rahman Protyasha
2021-10-22 Chris Lalancette
2021-10-22 Chris Lalancette
2021-10-22 Tomoya Fujita
2021-10-22 mergify[bot]
2021-10-22 Joakim Roubert
2021-10-20 Chris Lalancette
2021-10-19 Bi0T1N
2021-10-18 Chris Lalancette
2021-10-15 Chris Lalancette
2021-10-13 kurshakuz
2021-10-13 Chris Lalancette
2021-10-12 David V. Lu!!
2021-10-11 Christophe Bedard
2021-10-08 Lyle Johnson
2021-10-06 Chris Lalancette
2021-10-04 kenny_wang
2021-09-30 Scott K Logan
2021-09-30 Tully Foote
2021-09-29 Scott K Logan
2021-09-29 Scott K Logan
2021-09-27 Chris Lalancette
2021-09-27 Christophe Bedard
2021-09-24 Audrow Nash
2021-09-24 Audrow Nash
2021-09-23 Tully Foote
2021-09-22 kurshakuz
2021-09-20 Michel Hidalgo
2021-09-19 Chris Lalancette
2021-09-17 kurshakuz
2021-09-17 Chris Lalancette
2021-09-16 Katherine Scott
2021-09-16 kurshakuz
2021-09-14 Chris Lalancette
2021-09-14 Christophe Bedard
2021-09-14 kurshakuz
2021-09-13 William Woodall
2021-09-13 mergify[bot]
2021-09-13 Ralph Lange
2021-09-12 Nathan Brooks
2021-09-09 Christophe Bedard
2021-09-10 Geoffrey Biggs
2021-09-09 Christophe Bedard
2021-09-08 kurshakuz
2021-09-08 kurshakuz
2021-09-08 Alberto Soragna
2021-09-07 Alberto Soragna
2021-09-07 Chris Lalancette
2021-09-01 kurshakuz
2021-09-01 kurshakuz
2021-08-30 kurshakuz
2021-08-30 kurshakuz
2021-08-30 mergify[bot]
2021-08-30 kurshakuz
2021-08-27 Sid Faber
2021-08-26 mergify[bot]
2021-08-25 kurshakuz
2021-08-24 mergify[bot]
2021-08-24 mergify[bot]
2021-08-23 Tomoya Fujita
2021-08-23 Katherine Scott
2021-08-23 Joe Speed
2021-08-23 Bi0T1N
2021-08-21 Christophe Bedard
2021-08-21 Steve Macenski
2021-08-20 Greg Balke
2021-08-20 Steve Macenski
2021-08-19 Jacob Bandes-Storch
2021-08-19 Christophe Bedard
2021-08-19 Michael Terzer
2021-08-19 Audrow Nash
2021-08-16 kurshakuz
2021-08-13 kurshakuz
2021-08-13 Chris Lalancette
2021-08-13 kurshakuz
2021-08-11 Chris Lalancette
2021-08-10 kurshakuz
2021-08-09 kurshakuz
2021-08-06 Tully Foote
2021-08-04 Shane Loretz
2021-08-04 Christophe Bedard
2021-08-03 Tyler Weaver
2021-08-03 Bi0T1N
2021-08-03 Kenji Brameld
2021-07-27 Aditya Pande
2021-07-23 Tomoya Fujita
2021-07-22 Amey Kulkarni
2021-07-21 Steve Peters
2021-07-21 Bi0T1N
2021-07-20 Bi0T1N
2021-07-19 Chris Lalancette
2021-07-19 Bi0T1N
2021-07-19 Bi0T1N
2021-07-17 Bi0T1N
2021-07-16 Emerson Knapp
2021-07-15 mergify[bot]
2021-07-15 mergify[bot]
2021-07-14 kurshakuz
2021-07-12 Chris Lalancette
2021-07-07 David V. Lu!!
2021-07-07 Flobotics-robotics.com
2021-07-07 Katherine Scott
2021-07-06 rob-clarke
2021-07-06 Víctor Mayoral Vilches
2021-07-06 Pablo Garrido
2021-06-30 Abrar Rahman Protyasha
2021-06-30 Christophe Bedard
2021-06-30 kurshakuz
2021-06-30 Christophe Bedard
2021-06-30 Christophe Bedard
2021-06-25 Christophe Bedard
2021-06-24 Chris Lalancette
2021-06-23 Bi0T1N
2021-06-21 Steven! Ragnarök
2021-06-17 Audrow Nash
2021-06-15 Arne Nordmann
2021-06-15 Audrow Nash
2021-06-11 Steven! Ragnarök
2021-06-11 Arne Nordmann
2021-06-10 Víctor Mayoral Vilches
2021-06-07 Tomoya Fujita
2021-06-04 Ivan Santiago Paunovic
2021-06-03 gerkey
2021-06-03 gerkey
2021-06-03 Jochen Sprickerhof
2021-06-02 Chris Lalancette
2021-06-02 Chris Lalancette
2021-06-01 mergify[bot]
2021-05-28 Chris Lalancette
2021-05-27 Chris Lalancette
2021-05-26 Michel Hidalgo
2021-05-26 Audrow Nash
2021-05-25 Emerson Knapp
`;

function getUniqueAuthors() {
  const peopleSet = new Set<string>();
  text.split("\n").forEach((line) => {
    const [_date, ...name] = line.split(" ");
    if (name.length === 0) {
      return;
    }
    peopleSet.add(name.join(" "));
  });

  const people = Array.from(peopleSet).sort();

  console.log(people);
}

getUniqueAuthors();
