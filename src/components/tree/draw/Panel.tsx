import React, { FC } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  makeStyles,
  Theme,
  createStyles,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@material-ui/core';

export interface PanelProps {
  title: string | React.ReactNode;
  children?: React.ReactNode;
}

const panelStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '40px',
      backgroundColor: 'rgba(0, 0, 0, .03)',
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      '&.MuiAccordionSummary-root.Mui-expanded': {
        minHeight: 40,
        height: 40,
      },
      '&.MuiAccordionSummary-root': {
        minHeight: 40,
        height: 40,
      },
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    detail: {
      flexWrap: 'wrap',
      width: '100%',
    },
  }),
);

const Panel: FC<PanelProps> = (props) => {
  const classes = panelStyles();
  return (
    <Accordion defaultExpanded square>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.root}>
        <Typography className={classes.heading}>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.detail}>{props.children}</AccordionDetails>
    </Accordion>
  );
};
export default Panel;