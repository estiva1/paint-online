import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/canvas.scss";
import Brush from "../tools/Brush";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Rectangular from "../tools/Rectangular";
import axios from "axios";

const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const params = useParams();
  console.log(params);

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    let ctx = canvasRef.current.getContext("2d");
    axios
      .get(`http://localhost:5000/image?id=${params.id}`)
      .then((response) => {
        const img = new Image();
        img.src = response.data;
        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        };
      });
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket("ws://localhost:5000/"); //localhost
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));
      socket.onopen = () => {
        console.log("Connection established");
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case "connection":
            console.log(`User ${msg.username} connected!`);
            break;
          case "draw":
            drawHandler(msg);
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext("2d");
    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case "rect":
        Rectangular.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color,
          figure.stroke
        );
        break;
      case "finish":
        ctx.beginPath();
        break;
    }
  };

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
    axios
      .post(`http://localhost:5000/image?id=${params.id}`, {
        img: canvasRef.current.toDataURL(),
      })
      .then((response) => console.log(response.data));
    //localhost
  };

  const connectHandler = () => {
    canvasState.setUsername(usernameRef.current.value);
    setModal(false);
  };

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Enter your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group flex-nowrap">
            <span className="input-group-text" id="addon-wrapping">
              {"->"}
            </span>
            <input
              type="text"
              ref={usernameRef}
              className="form-control"
              placeholder="Name"
              aria-label="Name"
              aria-describedby="addon-wrapping"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectHandler()}>
            Log in
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseDown={() => mouseDownHandler()}
        ref={canvasRef}
        width={800}
        height={450}
      ></canvas>
    </div>
  );
});

export default Canvas;
