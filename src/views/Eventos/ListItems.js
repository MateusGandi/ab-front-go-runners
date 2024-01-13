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

export const MainListItems = ({ onItemClick }) => {
  const [activeItem, setActiveItem] = React.useState("dashboard");
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
    </React.Fragment>
  );
};

export const SecondaryListItems = (
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
