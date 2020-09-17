import React, { useState, useEffect } from 'react';
import './userCenter.css';
import { useDispatch } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { getUserInfo } from '../../redux/actions/authActions';
import { setMessage } from '../../redux/actions/commonActions';
import { TextField, Button } from '@material-ui/core';
import moment from 'moment';
import uploadFile from '../../components/common/upload';
import api from '../../services/api';
interface UserCenterProps {
  onClose: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '-10px 0px',
    },
    button: {
      backgroundColor: '#17B881',
      padding: '6 16px',
      color: '#fff',
    },
    input: {
      width: 'calc(100% - 115px)',
      marginRight: '10px',
      minWidth: '200px',
      '& .MuiInput-formControl': {
        marginTop: '0px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
      },
    },
  })
);
const UserCenter: React.FC<UserCenterProps> = (props) => {
  const { onClose } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const uploadToken = useTypedSelector((state) => state.auth.uploadToken);
  const token = useTypedSelector((state) => state.auth.token);
  const [avatar, setAvatar] = useState('');
  const [slogan, setSlogan] = useState('');
  const [trueName, setTrueName] = useState('');
  const [nickName, setNickName] = useState('');
  const [gender, setGender] = useState(0);
  const [birthday, setBirthday] = useState<any>(moment());
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  // onChange(date, dateString) {
  //   this.birthday = date;
  // },
  useEffect(() => {
    if (user) {
      getData(user);
    }
  }, [user]);
  const getData = (user: any) => {
    let profile = user.profile;
    setAvatar(profile.avatar);
    setSlogan(profile.slogan);
    setTrueName(profile.trueName);
    setNickName(profile.nickName);
    setGender(profile.gender);
    setBirthday(moment(profile.birthday).format('YYYY-MM-DD'));
    setEmail(profile.email);
    setMobile(user.mobile);
  };
  const saveuserInfo = async () => {
    let res: any = await api.auth.updateAccount({
      profile: {
        avatar: avatar,
        slogan: slogan,
        trueName: trueName,
        nickName: nickName,
        birthday: moment(birthday).valueOf(),
        email: email,
      },
    });
    if (res.msg === 'OK') {
      // console.log(res);
      dispatch(setMessage(true, '修改用户数据成功', 'success'));
      dispatch(getUserInfo(token));
      onClose();
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const uploadImg = (e: any) => {
    let mimeType = ['image/png', 'image/jpeg'];
    let item = {};
    let file = e.target.files[0];
    let reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = function (theFile: any) {
        let image = new Image();
        image.src = theFile.target.result;
        image.onload = function () {
          uploadFile.uploadImg(file, uploadToken, mimeType, function (
            url: string
          ) {
            setAvatar(url);
          });
        };
      };
    }
  };
  const handleDateChange = (date: any) => {
    setBirthday(date);
  };
  // toContact() {
  //   this.$router.push("/").catch((data) => {});
  // },
  return (
    <div className="user-home-content">
      <div className="user-home-avatar">
        <div className="user-title">头像</div>
        <div className="user-home-avatar-img">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              uploadImg(e);
            }}
            className="upload-img"
          />
          <img src={avatar} alt="" />
        </div>
      </div>

      <div className="user-input">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="昵称"
          className={classes.input}
          style={{ width: '100%' }}
          value={nickName}
          onChange={(e: any) => {
            setNickName(e.target.value);
          }}
        />
      </div>
      <div className="user-input">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="电子邮箱"
          className={classes.input}
          style={{ width: '100%' }}
          value={email}
          onChange={(e: any) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="user-input">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="个性签名"
          className={classes.input}
          style={{ width: '100%' }}
          value={slogan}
          onChange={(e: any) => {
            setSlogan(e.target.value);
          }}
        />
      </div>
      <div className="user-input">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="姓名"
          className={classes.input}
          style={{ width: '100%' }}
          value={trueName}
          onChange={(e: any) => {
            setTrueName(e.target.value);
          }}
        />
      </div>
      <div className="user-input">
        {/* <div className="user-title">生日</div> */}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-MM-DD"
            margin="normal"
            id="date-picker-inline"
            label="生日"
            value={birthday}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            className={classes.root}
          />
        </MuiPickersUtilsProvider>
      </div>
      <div className="user-button-info">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            saveuserInfo();
          }}
          style={{ marginRight: '10px' }}
          className={classes.button}
        >
          确认
        </Button>
        <Button variant="contained" onClick={onClose}>
          取消
        </Button>
      </div>
    </div>
  );
};
UserCenter.defaultProps = {};
export default UserCenter;
