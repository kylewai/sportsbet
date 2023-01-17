import useSWR from "swr";
import Drawer from '@mui/material/Drawer';
import Toolbar from "@mui/material/Toolbar";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { apiFetcher } from "./utils/DataFetcher";

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { NormalIcon, IconType } from "./utils/Icons";
import { Link } from "react-router-dom";
import { Offset } from "./CustomAppBar";

export interface ILeague {
    id: number,
    name: string,
    sportId: number
}

export interface ISport {
    id: number,
    name: string
}

export const Sidebar = () => {
    const { data: leagues, error: leagueError } = useSWR<ILeague[], Error>("/leagues", apiFetcher);
    const { data: sports, error: sportError } = useSWR<ISport[], Error>("/sports", apiFetcher);

    if (leagueError) {
        console.log(leagueError);
        return <div>failed to load</div>
    }
    if (!leagues || !sports) return <div>loading...</div>

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                "& .MuiDrawer-paper": { width: 240, boxSizing: 'border-box' },
            }}
        >
            <Offset />
            <Box sx={{ overflow: 'auto' }}>
                <QuickAccessLeaguesList leagues={leagues} />
                <Divider />
                <QuickAccessSportsList sports={sports} />
            </Box>
        </Drawer>
    );
}

const QuickAccessLeaguesList = (props: { leagues: ILeague[] }) => {
    return (
        <List>
            <ListItem>
            </ListItem>
            {props.leagues.map((league, _index) => (
                <Link key={league.name} to={"leagues/" + league.id + "/events"} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <NormalIcon iconType={IconType.League} iconKey={league.id} />
                            </ListItemIcon>
                            <ListItemText primary={league.name} />
                        </ListItemButton>
                    </ListItem>
                </Link>
            ))}
        </List>
    )
}

const QuickAccessSportsList = (props: { sports: ISport[] }) => {

    return (
        <List>
            {props.sports.map((sport, index) => (
                <Link key={sport.name} to={"leagues/" + sport.name} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={sport.name} />
                        </ListItemButton>
                    </ListItem>
                </Link>
            ))}
        </List>
    )
}