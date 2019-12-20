import React from "react";
const { Pattern } = require("react-hexgrid"); //TODO: again, create type declarations for this

const imageSize = { x: 3.4, y: 2.75 };
const positionImagesPath = "./images/positionImages/";

const Patterns = () => {
    return (
        <>
            <Pattern id="red" link={positionImagesPath + "red.png"} size={imageSize} />
            <Pattern id="blue" link={positionImagesPath + "blue.png"} size={imageSize} />
            <Pattern id="land" link={positionImagesPath + "land.png"} size={imageSize} />
            <Pattern id="water" link={positionImagesPath + "water.png"} size={imageSize} />
            <Pattern id="flag" link={positionImagesPath + "flag.png"} size={imageSize} />
            <Pattern id="redflag" link={positionImagesPath + "redflag.png"} size={imageSize} />
            <Pattern id="blueflag" link={positionImagesPath + "blueflag.png"} size={imageSize} />
            <Pattern id="airfield" link={positionImagesPath + "airfield.png"} size={imageSize} />
            <Pattern id="missile" link={positionImagesPath + "missile.png"} size={imageSize} />
        </>
    );
};

export default Patterns;
