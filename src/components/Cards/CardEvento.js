import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventIcon from "@mui/icons-material/Event";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { CardActionArea, Paper } from "@mui/material";
import Chip from "@mui/material/Chip";
import image from "../../images/event.png";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCardClick = (event) => {
    // Adicione o código que você deseja executar ao clicar no Card aqui
    alert("Card Clicado!");
    // Certifique-se de não chamar event.stopPropagation() se não quiser impedir a propagação do evento
  };
  const PaperStyle = {
    width: "40px",
    margin: "10px",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  };
  const TitleStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    zIndex: "2",
    justifyContent: "space-between",
  };
  const CardStyle = {
    margin: "10px",
    position: "relative",
  };
  return (
    <Card className="Card" sx={CardStyle} elevation={0}>
      <div style={TitleStyle}>
        <Paper style={PaperStyle} elevation={0}>
          <Typography variant="h6">12</Typography>
          <Typography variant="subtitle2">DEZ</Typography>
        </Paper>
      </div>
      <CardActionArea
        style={{ zIndex: "1" }}
        onClick={(event) => handleCardClick(event)}
      >
        <CardMedia
          component="img"
          image={image}
          alt="Paella dish"
          style={{
            pointerEvents: "none",
          }}
        />
      </CardActionArea>
      <CardActions disableSpacing>
        <Typography variant="subtitle2" color="text.secondary">
          <LocationOnOutlinedIcon />
          Brazil
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              R
            </Avatar>
          }
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
      </Collapse>
    </Card>
  );
}
