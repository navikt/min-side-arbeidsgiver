import fetchMock from "fetch-mock";

fetchMock.get("https://www.facebook.com/", {
  antall: 0,
  arbeidsforhold: [
    {
      ansettelsesperiode: {
        bruksperiode: {
          fom: "2015-01-06T21:44:04.748",
          tom: "2015-12-06T19:45:04"
        },
        periode: {
          fom: "2014-07-01",
          tom: "2015-12-31"
        },
        sporingsinformasjon: {
          endretAv: "Z990693",
          endretKilde: "AAREG",
          endretKildereferanse: "referanse-fra-kilde",
          endretTidspunkt: "2018-09-19T12:11:20.79",
          opprettetAv: "srvappserver",
          opprettetKilde: "EDAG",
          opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
          opprettetTidspunkt: "2018-09-19T12:10:58.059"
        },
        varslingskode: "ERKONK"
      },
      antallTimerForTimeloennet: [
        {
          antallTimer: 37.5,
          periode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          rapporteringsperiode: "2018-05",
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          }
        }
      ],
      arbeidsavtaler: [
        {
          antallTimerPrUke: 37.5,
          arbeidstidsordning: "ikkeSkift",
          beregnetAntallTimerPrUke: 37.5,
          bruksperiode: {
            fom: "2015-01-06T21:44:04.748",
            tom: "2015-12-06T19:45:04"
          },
          gyldighetsperiode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          sistLoennsendring: "string",
          sistStillingsendring: "string",
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          },
          stillingsprosent: 49.5,
          yrke: 2130123
        }
      ],
      arbeidsforholdId: "abc-321",
      arbeidsgiver: {
        type: "Organisasjon"
      },
      arbeidstaker: {
        type: "Person",
        aktoerId: 1234567890,
        offentligIdent: 31126700000
      },
      innrapportertEtterAOrdningen: true,
      navArbeidsforholdId: 123456,
      opplysningspliktig: {
        type: "Organisasjon"
      },
      permisjonPermitteringer: [
        {
          periode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          permisjonPermitteringId: "123-xyz",
          prosent: 50.5,
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          },
          type: "permisjonMedForeldrepenger"
        }
      ],
      registrert: "2018-09-18T11:12:29",
      sistBekreftet: "2018-09-19T12:10:31",
      sporingsinformasjon: {
        endretAv: "Z990693",
        endretKilde: "AAREG",
        endretKildereferanse: "referanse-fra-kilde",
        endretTidspunkt: "2018-09-19T12:11:20.79",
        opprettetAv: "srvappserver",
        opprettetKilde: "EDAG",
        opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
        opprettetTidspunkt: "2018-09-19T12:10:58.059"
      },
      type: "ordinaertArbeidsforhold",
      utenlandsopphold: [
        {
          landkode: "JPN",
          periode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          rapporteringsperiode: "2017-12",
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          }
        }
      ]
    },
    {
      ansettelsesperiode: {
        bruksperiode: {
          fom: "2015-01-06T21:44:04.748",
          tom: "2015-12-06T19:45:04"
        },
        periode: {
          fom: "2014-07-01",
          tom: "2015-12-31"
        },
        sporingsinformasjon: {
          endretAv: "Z990693",
          endretKilde: "AAREG",
          endretKildereferanse: "referanse-fra-kilde",
          endretTidspunkt: "2018-09-19T12:11:20.79",
          opprettetAv: "srvappserver",
          opprettetKilde: "EDAG",
          opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
          opprettetTidspunkt: "2018-09-19T12:10:58.059"
        },
        varslingskode: "ERKONK"
      },
      antallTimerForTimeloennet: [
        {
          antallTimer: 37.5,
          periode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          rapporteringsperiode: "2018-05",
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          }
        }
      ],
      arbeidsavtaler: [
        {
          antallTimerPrUke: 37.5,
          arbeidstidsordning: "ikkeSkift",
          beregnetAntallTimerPrUke: 37.5,
          bruksperiode: {
            fom: "2015-01-06T21:44:04.748",
            tom: "2015-12-06T19:45:04"
          },
          gyldighetsperiode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          sistLoennsendring: "string",
          sistStillingsendring: "string",
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          },
          stillingsprosent: 49.5,
          yrke: 2130123
        }
      ],
      arbeidsforholdId: "abc-321",
      arbeidsgiver: {
        type: "Organisasjon"
      },
      arbeidstaker: {
        type: "Person",
        aktoerId: 1234567890,
        offentligIdent: 31126700000
      },
      innrapportertEtterAOrdningen: true,
      navArbeidsforholdId: 123456,
      opplysningspliktig: {
        type: "Organisasjon"
      },
      permisjonPermitteringer: [
        {
          periode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          permisjonPermitteringId: "123-xyz",
          prosent: 50.5,
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          },
          type: "permisjonMedForeldrepenger"
        }
      ],
      registrert: "2018-09-18T11:12:29",
      sistBekreftet: "2018-09-19T12:10:31",
      sporingsinformasjon: {
        endretAv: "Z990693",
        endretKilde: "AAREG",
        endretKildereferanse: "referanse-fra-kilde",
        endretTidspunkt: "2018-09-19T12:11:20.79",
        opprettetAv: "srvappserver",
        opprettetKilde: "EDAG",
        opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
        opprettetTidspunkt: "2018-09-19T12:10:58.059"
      },
      type: "ordinaertArbeidsforhold",
      utenlandsopphold: [
        {
          landkode: "JPN",
          periode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          rapporteringsperiode: "2017-12",
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          }
        }
      ]
    },
    {
      ansettelsesperiode: {
        bruksperiode: {
          fom: "2015-01-06T21:44:04.748",
          tom: "2015-12-06T19:45:04"
        },
        periode: {
          fom: "2014-07-01",
          tom: "2015-12-31"
        },
        sporingsinformasjon: {
          endretAv: "Z990693",
          endretKilde: "AAREG",
          endretKildereferanse: "referanse-fra-kilde",
          endretTidspunkt: "2018-09-19T12:11:20.79",
          opprettetAv: "srvappserver",
          opprettetKilde: "EDAG",
          opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
          opprettetTidspunkt: "2018-09-19T12:10:58.059"
        },
        varslingskode: "ERKONK"
      },
      antallTimerForTimeloennet: [
        {
          antallTimer: 37.5,
          periode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          rapporteringsperiode: "2018-05",
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          }
        }
      ],
      arbeidsavtaler: [
        {
          antallTimerPrUke: 37.5,
          arbeidstidsordning: "ikkeSkift",
          beregnetAntallTimerPrUke: 37.5,
          bruksperiode: {
            fom: "2015-01-06T21:44:04.748",
            tom: "2015-12-06T19:45:04"
          },
          gyldighetsperiode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          sistLoennsendring: "string",
          sistStillingsendring: "string",
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          },
          stillingsprosent: 49.5,
          yrke: 2130123
        }
      ],
      arbeidsforholdId: "abc-321",
      arbeidsgiver: {
        type: "Organisasjon"
      },
      arbeidstaker: {
        type: "Person",
        aktoerId: 1234567890,
        offentligIdent: 31126700000
      },
      innrapportertEtterAOrdningen: true,
      navArbeidsforholdId: 123456,
      opplysningspliktig: {
        type: "Organisasjon"
      },
      permisjonPermitteringer: [
        {
          periode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          permisjonPermitteringId: "123-xyz",
          prosent: 50.5,
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          },
          type: "permisjonMedForeldrepenger"
        }
      ],
      registrert: "2018-09-18T11:12:29",
      sistBekreftet: "2018-09-19T12:10:31",
      sporingsinformasjon: {
        endretAv: "Z990693",
        endretKilde: "AAREG",
        endretKildereferanse: "referanse-fra-kilde",
        endretTidspunkt: "2018-09-19T12:11:20.79",
        opprettetAv: "srvappserver",
        opprettetKilde: "EDAG",
        opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
        opprettetTidspunkt: "2018-09-19T12:10:58.059"
      },
      type: "ordinaertArbeidsforhold",
      utenlandsopphold: [
        {
          landkode: "JPN",
          periode: {
            fom: "2014-07-01",
            tom: "2015-12-31"
          },
          rapporteringsperiode: "2017-12",
          sporingsinformasjon: {
            endretAv: "Z990693",
            endretKilde: "AAREG",
            endretKildereferanse: "referanse-fra-kilde",
            endretTidspunkt: "2018-09-19T12:11:20.79",
            opprettetAv: "srvappserver",
            opprettetKilde: "EDAG",
            opprettetKildereferanse: "22a26849-aeef-4b81-9174-e238c11e1081",
            opprettetTidspunkt: "2018-09-19T12:10:58.059"
          }
        }
      ]
    }
  ]
});
