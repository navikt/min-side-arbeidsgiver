import fetchMock from 'fetch-mock';

fetchMock.get(
    'min-side-arbeidsgiver/api/feature?feature=dna.bedriftsvelger.brukNyBedriftsvelger',
    {"tilgang":true}
);
