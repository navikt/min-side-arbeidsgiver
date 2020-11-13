import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";

const AdvarselBannerTestversjon = () => {
    return (
        <>
            {window.location.hostname.includes('labs.nais.io') && (
                <AlertStripeAdvarsel >
                    <b>Dette er en testversjon</b>
                    <br />
                    Her kan du bli bedre kjent med Min side – Arbeidsgiver.
                    <br />
                </AlertStripeAdvarsel>
            )}
        </>
    );
};

export default AdvarselBannerTestversjon;