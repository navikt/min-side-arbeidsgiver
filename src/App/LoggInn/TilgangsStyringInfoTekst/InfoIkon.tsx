import React from 'react';

interface Props {
    size: string;
}

const InfoIkon = ({size}: Props) => (
    <svg
        className="informasjonsboks__ikon"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
    >
        <g fill="none" fillRule="evenodd">
            <path fill="#669DB4" d="M12 0C5.382 0 0 5.382 0 12s5.382 12 12 12c6.617 0 12-5.382 12-12S18.617 0 12 0z"/>
            <g fill="#FFF">
                <path d="M12.55 5c.83 0 1.507.701 1.507 1.565 0 .866-.677 1.565-1.507 1.565-.833 0-1.507-.7-1.507-1.565 0-.864.674-1.565 1.507-1.565z"/>
                <path fillRule="nonzero" d="M15.414 17.01a.997.997 0 0 1 1.004.991c0 .56-.461.992-1.004.992h-5.375A.997.997 0 0 1 9.035 18c0-.56.46-.99 1.004-.99h1.54v-5.016h-.95a.997.997 0 0 1-1.004-.991c0-.56.461-.991 1.005-.991h1.953a.997.997 0 0 1 1.004.99v6.007h1.827z"/>
            </g>
        </g>
    </svg>
);

export default InfoIkon;