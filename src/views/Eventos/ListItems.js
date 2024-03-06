import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export const SecondaryListItems = () => (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Relatórios
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Receita Mensal" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Receita Semanal" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Receita Diária" />
    </ListItemButton>
  </React.Fragment>
);

export const MainListItems = (props) => {
  const { onItemClick, opened } = props;
  const [open, setOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState("dashboard");

  const handleClick = () => {
    setOpen(!open);
  };

  const handleItemClick = (item) => {
    onItemClick(item);
    setActiveItem(item);
  };

  return (
    <React.Fragment>
      <ListItemButton
        onClick={() => handleItemClick("dashboard")}
        selected={activeItem === "dashboard"}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton
        onClick={() => handleItemClick("novoEvento")}
        selected={activeItem === "novoEvento"}
      >
        <ListItemIcon>
          <EmojiEventsIcon />
        </ListItemIcon>
        <ListItemText primary="Novo Evento" />
      </ListItemButton>
      <ListItemButton
        onClick={() => handleItemClick("gerenciarPerfis")}
        selected={activeItem === "gerenciarPerfis"}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Gerenciar Perfis" />
      </ListItemButton>
      <ListItemButton
        onClick={() => handleItemClick("pagamentos")}
        selected={activeItem === "pagamentos"}
      >
        <ListItemIcon>
          <PaymentIcon />
        </ListItemIcon>
        <ListItemText primary="Pagamentos" />
      </ListItemButton>
      <ListItemButton
        onClick={() => handleItemClick("campanhas")}
        selected={activeItem === "campanhas"}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Campanhas" />
      </ListItemButton>
      <ListItemButton
        onClick={() => handleItemClick("configuracoes")}
        selected={activeItem === "configuracoes"}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Configurações" />
      </ListItemButton>

      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          {(!opened ? false : open) ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>
        <ListItemText primary="Assets" />
      </ListItemButton>
      {/* Additional items can be added here */}
      <Collapse in={!opened ? false : open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            sx={{ pl: 4 }}
            onClick={() => handleItemClick("organizadores")}
            selected={activeItem === "organizadores"}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Organizadores" />
          </ListItemButton>
        </List>
      </Collapse>
      <Collapse in={!opened ? false : open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            sx={{ pl: 4 }}
            onClick={() => handleItemClick("formularios")}
            selected={activeItem === "formularios"}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Formulários" />
          </ListItemButton>
        </List>
      </Collapse>
      <Collapse in={!opened ? false : open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            sx={{ pl: 4 }}
            onClick={() => handleItemClick("produtos")}
            selected={activeItem === "produtos"}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Produtos" />
          </ListItemButton>
        </List>
      </Collapse>
    </React.Fragment>
  );
};
