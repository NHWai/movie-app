import {
  CardContent,
  Typography,
  CardActions,
  Button,
  Card,
  Box,
  Stack,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./MyProvider";

type PropsCardItem = {
  year: number;
  title: string;
  directorname: string;
  review: string;
  rating: number;
  movieid: string;
  user: string;
  setMovId: React.Dispatch<React.SetStateAction<string>>;
};

export const CardItem = (props: PropsCardItem) => {
  const { token } = React.useContext(MyContext);
  const navigate = useNavigate();
  const { year, title, directorname, review, rating, movieid, user } = props;

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

  // return (
  //   <Card>
  //     <CardContent>
  //       <Typography
  //         sx={{ fontSize: 12, fontStyle: "italic" }}
  //         color="text.secondary"
  //         gutterBottom
  //       >
  //         Released Date : {year}
  //       </Typography>
  //       <Typography variant="h5" component="div">
  //         {title}
  //       </Typography>
  //       <Typography
  //         sx={{ mb: 1.5, fontSize: 12, fontStyle: "italic" }}
  //         color="text.secondary"
  //       >
  //         Directed by {directorname}
  //       </Typography>
  //       <Typography variant="body1">{review} </Typography>
  //       <Typography variant="body2">{`"Rating:${rating}"`}</Typography>
  //     </CardContent>
  //     <CardActions>
  //       <Box sx={{ display: "flex", width: "100%" }}>
  //         <Box sx={{ flexGrow: 1 }}>
  //           <Button onClick={() => navigate(`/movie/${movieid}`)} size="small">
  //             See More
  //           </Button>
  //         </Box>
  //         <Box>
  //           <Button
  //             onClick={() => navigate(`/edit/${movieid}`)}
  //             color="success"
  //             disabled={user === token.id ? false : true}
  //             size="small"
  //           >
  //             Edit
  //           </Button>
  //           <Button
  //             onClick={handleDelete}
  //             color="error"
  //             disabled={user === token.id ? false : true}
  //             size="small"
  //           >
  //             Delete
  //           </Button>
  //         </Box>
  //       </Box>
  //     </CardActions>
  //   </Card>
  // );
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
      <Typography variant="body1">{review} </Typography>
      <Typography variant="body2">{`"Rating:${rating}"`}</Typography>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Button onClick={() => navigate(`/movie/${movieid}`)} size="small">
            See More
          </Button>
        </Box>

        <Box>
          <Button
            onClick={() => navigate(`/edit/${movieid}`)}
            color="success"
            disabled={user === token.id ? false : true}
            size="small"
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={user === token.id ? false : true}
            size="small"
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
