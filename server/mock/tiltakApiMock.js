const arbeidsavtalermock = [
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "VARIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "INKLUDERINGSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "ARBEIDSTRENING"
  },
  {
    "tiltakstype": "INKLUDERINGSTILSKUDD"
  },
  {
    "tiltakstype": "MENTOR"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "ARBEIDSTRENING"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "MENTOR"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "VARIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MENTOR"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "ARBEIDSTRENING"
  },
  {
    "tiltakstype": "INKLUDERINGSTILSKUDD"
  },
  {
    "tiltakstype": "ARBEIDSTRENING"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "VARIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "SOMMERJOBB"
  },
  {
    "tiltakstype": "VARIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "ARBEIDSTRENING"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MENTOR"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  },
  {
    "tiltakstype": "MIDLERTIDIG_LONNSTILSKUDD"
  }
];

module.exports = {
    mock: (app) => {
        app.use("/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler/", (req, res) => res.send(arbeidsavtalermock));
    }
};