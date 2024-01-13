import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function ActionAreaCard(props) {
  const { image, title, description } = props;
  return (
    <Card style={{ margin: "0 5px" }}>
      <CardActionArea>
        <CardContent
          style={{
            width: "160px",
            height: "160px",
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={image}
            alt="Error"
            style={{
              pointerEvents: "none",
              width: "50px",
              height: "50px",
            }}
          />
          <Typography
            textAlign="center"
            gutterBottom
            variant="h8"
            component="div"
          >
            - {title} -
          </Typography>
          <Typography textAlign="center" variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
