import { Typography, Button, Stack, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./MyProvider";

type PropsCardItem = {
  year: number | string;
  title: string;
  directorname: string;
  genres: string[];
  rating: number | string;
  movieid: string;
  user: string;
  setMovId: React.Dispatch<React.SetStateAction<string>>;
};

export const CardItem = (props: PropsCardItem) => {
  const { token } = useContext(MyContext);
  const navigate = useNavigate();

  const { year, title, directorname, genres, rating, movieid, user } = props;
  const delMovie = async (movieid: string, tokenstr: string) => {
    const url = `${process.env.REACT_APP_BASE_URL}/movies/${movieid}`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${tokenstr}`);
    try {
      const res = await fetch(url, {
        headers: myHeaders,
        method: "DELETE",
        redirect: "follow",
      });
      if (res.status === 204) {
        // add movie id to list to be hidden
        props.setMovId(movieid);
      } else if (res.status === 401) {
        throw Error(`Unauthorized user, login or signup`);
      } else {
        throw Error("Cannot delete the movie");
      }
    } catch (err) {
      navigate(`error/${err}`);
    }
  };

  const handleDelete = () => {
    delMovie(movieid, token.tokenStr);
  };

  return (
    <Stack
      height={"270px"}
      p={1}
      justifyContent={"space-evenly"}
      sx={{
        borderRadius: "0.3rem",
        boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
        transition: "0.3s",
        "&:hover": { boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" },
      }}
    >
      <Typography
        sx={{ fontSize: 12, fontStyle: "italic" }}
        color="text.secondary"
        gutterBottom
      >
        Released Date : {year}
      </Typography>
      <Typography variant="h5" component="div">
        {title}
      </Typography>
      <Typography
        sx={{ mb: 1.5, fontSize: 12, fontStyle: "italic" }}
        color="text.secondary"
      >
        Directed by {directorname}
      </Typography>
      <Typography variant="body2">Genres: {genres?.join(", ")} </Typography>
      <Typography variant="caption">{`"Rating:${rating}"`}</Typography>
      <Grid container>
        <Grid item xs={12}>
          <Button component={RouterLink} to={`/movie/${movieid}`} size="small">
            See More
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Stack direction={"row"} spacing={1}>
            <Button
              variant="outlined"
              color="info"
              disabled={user === token.id ? false : true}
              component={RouterLink}
              to={`/edit/${movieid}`}
              size="small"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              disabled={user === token.id ? false : true}
              size="small"
            >
              Delete
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};
