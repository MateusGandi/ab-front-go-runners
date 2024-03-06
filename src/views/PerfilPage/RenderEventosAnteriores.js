import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  Chip,
  CardActionArea,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PendingIcon from "@mui/icons-material/Pending";

const ListItemWithMenu = ({ title, subtitle, flags, content }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function status(status) {
    switch (status) {
      case "approved":
        return {
          value: "Pagamento aprovado",
          icon: <DoneIcon />,
          color: "success",
        };
      case "pending":
        return { value: "Pendente de pagamento", color: "primary" };
      case "cancelled":
        return {
          value: "Cancelado",
          icon: <HighlightOffIcon />,
          color: "secondary",
        };
      case "reimbursementrequired":
        return {
          value: "Reembolso requerido",
          color: "secondary",
        };
      case "reimbursement":
        return {
          value: "Reembolsado",
          color: "secondary",
        };
      case "gratuito":
        return {
          value: "Evento Gratuito",
          icon: <DoneIcon />,
          color: "success",
        };
      default:
        return {
          value: "Status desconhecido",
          icon: <ErrorOutlineIcon />,
          color: "warning",
        };
    }
  }

  return (
    <ListItem>
      <ListItemText
        primary={title}
        secondary={subtitle}
        sx={{ whiteSpace: "pre-wrap" }}
      />
      <div>
        {content.map((item) => (
          <Chip
            sx={{ padding: "0 2px", margin: "10px" }}
            onDelete={status(item).icon ? () => console.log("oi") : undefined}
            color={status(item).color}
            variant={
              status(item).color === "primary" ? "outlined" : "contained"
            }
            size="small"
            label={status(item).value}
            deleteIcon={status(item).icon}
          />
        ))}
      </div>
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {flags &&
            flags.map((flag, index) => (
              <MenuItem
                key={index}
                onClick={flag.function}
                color="textSecondary"
              >
                {flag.value}
              </MenuItem>
            ))}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ListItemWithMenu;
