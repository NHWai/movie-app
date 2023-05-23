import { Typography, Button, Stack, Icon, Box } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./MyProvider";
import StarRateIcon from "@mui/icons-material/StarRate";
import { deleteMovie } from "../features/movies/moviesSlice";
import { useAppDispatch } from "../app/hooks";

type PropsCardItem = {
  year: number | string;
  title: string;
  directorname: string;
  genres: string[];
  rating: number | string;
  movieid: string;
  photoId: string;
  photoUrl: string;
  user: string;
  totalReviews: number;
};

export const CardItem = (props: PropsCardItem) => {
  const { token } = useContext(MyContext);
  const [isDel, setIsDel] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const { title, rating, movieid, user, photoId, totalReviews, photoUrl } =
    props;

  const delMovie = async (
    movieid: string,
    tokenstr: string,
    photoId: string
  ) => {
    const url = `${process.env.REACT_APP_BASE_URL}/movies/${movieid}/photoid/${photoId}`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${tokenstr}`);
    try {
      const res = await fetch(url, {
        headers: myHeaders,
        method: "DELETE",
        redirect: "follow",
      });
      if (res.status === 204) {
        dispatch(deleteMovie(movieid));
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
    setIsDel(true);
    delMovie(movieid, token.tokenStr, photoId.slice(4));
  };

  return (
    <Box
      sx={{
        height: searchParams.get("userid") ? "255px" : "230px",
        padding: 1,
        margin: 0.8,
        borderRadius: "0.3rem",
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        component={RouterLink}
        to={`/movie/${movieid}`}
      ></Box>
      <Box
        sx={{
          height: "150px",
          width: "100%",
        }}
      >
        <img
          src={photoUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <Typography
          variant="body1"
          fontWeight={"bold"}
          component="div"
          align="center"
        >
          {title}
        </Typography>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={0.5}
        >
          <Typography
            variant="body2"
            fontStyle={"italic"}
          >{`Rating : ${rating}`}</Typography>
          <Stack mt={-1}>
            <Icon fontSize="small">
              <StarRateIcon color="warning" />
            </Icon>
          </Stack>
          <Typography variant="caption">
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </Typography>
        </Stack>

        {searchParams.get("userid") && (
          <Stack direction={"row"} spacing={1} justifyContent={"center"}>
            <Button
              variant="outlined"
              color="info"
              disabled={isDel ? true : user === token.id ? false : true}
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
              disabled={isDel ? true : user === token.id ? false : true}
              size="small"
            >
              Delete
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};
