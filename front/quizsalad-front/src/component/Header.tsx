import { Modal } from "@mui/material";
import styles from '@/styles/Home.module.css'
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FC } from "react";
import Image from "next/image";
import Link from 'next/link';

interface MyComponentProps {
  site: string;
}

const Header: FC<MyComponentProps> = ({ site }) => {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imageURL  = '/person.png';

  if (site == "home") {
    var homeURL = ""
    var createquizURL = "/quiz/createquiz"
    var answerquizURL = "/quiz/answerquiz"
    return (
      <>
        <header>
          <h1>
            <img className={styles.logo} src='../favicon.ico'/>
            <a className={styles.title} href="/home">Quizsalad</a>
          </h1>
          <nav className={styles.hednav}>
            <ul>
              <li><a href={homeURL} className={styles.headselect}>ホーム</a></li>
              <li><Link href={createquizURL}>問題作成</Link></li>
              <li><Link href={answerquizURL}>問題回答</Link></li>
              <div onClick={handleOpen}>
                {imageURL && <img className={styles.triming} src={imageURL} />}
              </div>
              <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                <div className={styles.popup}>
                {imageURL && <img className={styles.acountPop} src={imageURL} />}
                <p>{session?.user?.name} <span>でログイン中</span></p>
                <hr className={styles.line}></hr>
                <Link href={homeURL}><div>ホーム</div></Link>
                <Link href={createquizURL}><div>問題作成</div></Link>
                <Link href={answerquizURL}><div>問題回答</div></Link>
                <p className={styles.logout} onClick={() => {
                  const url = process.env.API_FRONT + '/api/v1/token/delete'
                  const Options = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: session?.user.id,
                      token: session?.user.accessToken,
                    }),
                  };
                  const result = fetch(url, Options).catch(res => {console.log(res)})                
                  signOut({callbackUrl: "/"})
                }}><div><img src='../LogoutIcon.svg' width='18px' ></img>ログアウト</div></p>
              </div>    
              </Modal>
            </ul>
          </nav>
        </header>
      </>
    )
  } else if (site == "createquiz"){
    var homeURL = "/home"
    var createquizURL = ""
    var answerquizURL = "/quiz/answerquiz"
    return (
      <>
        <header>
          <h1>
            <img className={styles.logo} src='../favicon.ico' />
            <a className={styles.title} href="/home">Quizsalad</a>
          </h1>
          <nav className={styles.hednav}>
            <ul>
              <li><a href={homeURL} >ホーム</a></li>
              <li><Link href={createquizURL} className={styles.headselect}>問題作成</Link></li>
              <li><Link href={answerquizURL}>問題回答</Link></li>
              <div onClick={handleOpen}>
                {imageURL && <img className={styles.triming} src={imageURL} />}
              </div>
              <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                <div className={styles.popup}>
                {imageURL && <img className={styles.acountPop} src={imageURL} />}
                <p>{session?.user?.name} <span>でログイン中</span></p>
                <hr className={styles.line}></hr>
                <Link href={homeURL}><div>ホーム</div></Link>
                <Link href={createquizURL}><div>問題作成</div></Link>
                <Link href={answerquizURL}><div>問題回答</div></Link>
                <p className={styles.logout} onClick={() => {
                  const url = process.env.API_FRONT + '/api/v1/token/delete'
                  const Options = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: session?.user.id,
                      token: session?.user.accessToken,
                    }),
                  };
                  const result = fetch(url, Options).catch(res => {console.log(res)})                
                  signOut({callbackUrl: "/"})
                }}><div><img src='../LogoutIcon.svg' width='18px' ></img>ログアウト</div></p>
              </div>    
              </Modal>
            </ul>
          </nav>
        </header>
      </>
    )
  } else if (site == "answerquiz") {
    var homeURL = "/home"
    var createquizURL = "/quiz/createquiz"
    var answerquizURL = ""
    return (
      <>
        <header>
          <h1>
            <img className={styles.logo} src='../favicon.ico' />
            <a className={styles.title} href="/home">Quizsalad</a>
          </h1>
          <nav className={styles.hednav}>
            <ul>
                <li><a href={homeURL}>ホーム</a></li>
                <li><Link href={createquizURL}>問題作成</Link></li>
                <li><Link href={answerquizURL} className={styles.headselect}>問題回答</Link></li>
                <div onClick={handleOpen}>
                {imageURL && <img className={styles.triming} src={imageURL} />}
                </div>
              <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                <div className={styles.popup}>
                {imageURL && <img className={styles.acountPop} src={imageURL} />}
                <p>{session?.user?.name} <span>でログイン中</span></p>
                <hr className={styles.line}></hr>
                <Link href={homeURL}><div>ホーム</div></Link>
                <Link href={createquizURL}><div>問題作成</div></Link>
                <Link href={answerquizURL}><div>問題回答</div></Link>
                <p className={styles.logout} onClick={() => {
                  const url = process.env.API_FRONT + '/api/v1/token/delete'
                  const Options = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: session?.user.id,
                      token: session?.user.accessToken,
                    }),
                  };
                  const result = fetch(url, Options).catch(res => {console.log(res)})                
                  signOut({callbackUrl: "/"})
                }}><div><img src='../LogoutIcon.svg' width='18px' ></img>ログアウト</div></p>
              </div>    
              </Modal>
            </ul>
          </nav>
        </header>
      </>
    )
  } else if (site == "answer") {
    var homeURL = "/home"
    return (
      <>
        <header>
          <h1>
            <img className={styles.logo} src='../../favicon.ico' />
            <a className={styles.title} href="/home">Quizsalad</a>
          </h1>
          <nav className={styles.hednav}>
            <ul>
                <div onClick={handleOpen}>
                  <CloseIcon></CloseIcon>
                </div>
              <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                <div className={styles.popup}>
                {imageURL && <img className={styles.acountPop} src={imageURL} />}
                <p>{session?.user?.name} <span>でログイン中</span></p>
                <hr className={styles.line}></hr>
                <Link href={homeURL}><div>ホームに戻る</div></Link>
                <p className={styles.logout} onClick={() => {
                  const url = process.env.API_FRONT + '/api/v1/token/delete'
                  const Options = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: session?.user.id,
                      token: session?.user.accessToken,
                    }),
                  };
                  const result = fetch(url, Options).catch(res => {console.log(res)})                
                  signOut({callbackUrl: "/"})
                }}><div><img src='../../LogoutIcon.svg' width='18px' ></img>ログアウト</div></p>
              </div>    
              </Modal>
            </ul>
          </nav>
        </header>
      </>
    )
  }
}

export default Header;