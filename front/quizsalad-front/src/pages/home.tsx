import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from "@/styles/Home.module.css";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleProfileClick = () => {
    window.location.href = 'http://localhost:3000/user/change';
    handleClose();
  };



  const handleLogoutClick = () => {
    window.location.href = '.http://localhost:3000';
    handleClose();
  };

  return (
  <>
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        menu
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </div>
  


    
    
    <div className={styles.center}>
          <h1>
            welcome to quizland
          </h1>
     </div>
    <div className={styles.grid}>
    <a
      href="http://localhost:3000/quiz/createquiz"
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
     >
      <h2>
        createquiz <span>-&gt;</span>
      </h2>
      <p>
        
      </p>
    </a>

    <a
      href="http://localhost:3000/quiz/answerquiz"
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2>
        answerquiz <span>-&gt;</span>
      </h2>
      <p>
        
      </p>
    </a> 
   
    </div>
  
  </>
  );
}