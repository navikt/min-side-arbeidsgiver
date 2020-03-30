import fetchMock from 'fetch-mock';

fetchMock.get('min-side-arbeidsgiver/api/feature?feature=msa.visRefusjon', {
    tilgang: true,
});
