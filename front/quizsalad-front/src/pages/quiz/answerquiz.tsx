import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const cardData = [
  { id: 1, subject: 'Mathematics' },
  { id: 2, subject: 'Science' },
  { id: 3, subject: 'History' },
  { id: 4, subject: 'English' },
  { id: 5, subject: 'Geography' },
];

const BasicModal = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Button href="../quiz/Answer?id=1" variant="contained" sx={{ mb: 2, display: 'block' }} id={`delete-btn-${1}`}>
          回答
        </Button>
        <Button href="https://google.com" variant="contained" sx={{ mb: 2, display: 'block' }}>
          削除
        </Button>
        <Button href="https://google.com" variant="contained" sx={{ mb: 2, display: 'block' }}>
          編集
        </Button>
      </Box>
    </Modal>
  );
};

const OutlinedCard = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
      {cardData.map((card) => (
        <Card key={card.id} variant="outlined">
          <CardContent>
            <Typography variant="h5" component="div">
              {card.subject}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={handleOpen}>Detail</Button>
          </CardActions>
          <BasicModal open={open} handleClose={handleClose} />
        </Card>
      ))}
    </Box>
  );
};

export default OutlinedCard;

