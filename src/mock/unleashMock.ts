import fetchMock from 'fetch-mock';

export const mock = () => {
    fetchMock.get('/min-side-arbeidsgiver/api/feature?feature=msa.visMoteKalender', {
        "msa.visMoteKalender": true
    });
}
