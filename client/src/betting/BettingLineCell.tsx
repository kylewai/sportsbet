import { useContext } from "react";
import { BetSlipContext } from "./BetSlipProvider";
import Grid from '@mui/material/Grid';

interface IBettingLineCellProps {
    betHandler: () => void;
    children: React.ReactNode;
    id: string;
}

export const BettingLineCell = ({ betHandler, children, id }: IBettingLineCellProps) => {
    const { betSlip } = useContext(BetSlipContext);

    return (
        <Grid id={id} item container
            alignItems="center"
            justifyContent="center"
            className={betSlip[id] !== undefined ? "bettingLine-cell-selected" : "bettingLine-cell"}
            onClick={() => betHandler()}>
            {children}
        </Grid>
    )
}