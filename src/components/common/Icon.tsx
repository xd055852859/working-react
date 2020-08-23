import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
  })
);
interface Props {
  uri: string;
  onClick?: Function;
  width?: number;
  height?: number;
}
export default function Icon({ uri, onClick, width, height }: Props) {
  const classes = useStyles();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={classes.icon}
      style={{
        backgroundImage: `url(${uri})`,
        width: width ? `${width}px` : "20px",
        height: height ? `${height}px` : "20px",
      }}
      onClick={handleClick}
    ></div>
  );
}
