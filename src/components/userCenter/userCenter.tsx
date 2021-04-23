import React, { useState, useEffect, useRef } from 'react';
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
import { Input, Button, Radio, DatePicker, Modal } from 'antd';
const { TextArea } = Input;
import moment from 'moment';
import uploadFile from '../../components/common/upload';
import Dialog from '../common/dialog';
import api from '../../services/api';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
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
  const [upImg, setUpImg] = useState<any>(null);
  const [cropper, setCropper] = useState<any>(null);
  const [photoVisible, setPhotoVisible] = useState<any>(false);

  const [slogan, setSlogan] = useState('');
  const [trueName, setTrueName] = useState('');
  const [nickName, setNickName] = useState('');
  const [gender, setGender] = useState('0');
  const [birthday, setBirthday] = useState<any>(moment());
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  // onChange(date, dateString) {
  //   this.birthday = date;
  // },
  const cropperRef = useRef<HTMLImageElement>(null);
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
    setGender(profile.gender + '');
    setBirthday(moment(profile.birthday));
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
        birthday: birthday.valueOf(),
        email: email,
        gender: parseInt(gender),
      },
    });
    if (res.msg === 'OK') {
      dispatch(setMessage(true, '修改用户数据成功', 'success'));
      dispatch(getUserInfo(token));
      onClose();
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const uploadImg = () => {
    let mimeType = ['image/png', 'image/jpeg'];
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      minWidth: 100,
      minHeight: 200,
      width: 400,
      height: 800,
      maxWidth: 800,
      maxHeight: 800,
    });
    let dataURL = croppedCanvas.toDataURL('image/png');
    let imgFile = dataURLtoFile(dataURL);

    uploadFile.uploadImg(
      imgFile,
      uploadToken,
      mimeType,
      function (url: string) {
        dispatch(setMessage(true, '图片上传成功', 'success'));
        setAvatar(url);
      }
    );
  };
  const handleDateChange = (date: any) => {
    setBirthday(date);
  };
  // toContact() {
  //   this.$router.push("/").catch((data) => {});
  // },
  const dataURLtoFile = (dataurl: string, filename = 'file') => {
    let arr: any = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split('/')[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime,
    });
  };
  const chooseImg = (e: any) => {
    const fileReader = new FileReader();
    setPhotoVisible(true);
    fileReader.onload = (e: any) => {
      const dataURL = e.target.result;
      setUpImg(dataURL);
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };
  return (
    <div className="user-home-content">
      <div className="user-home-avatar">
        <div className="user-title">头像</div>
        <div className="user-home-avatar-img">
          <input
            type="file"
            accept="image/*"
            onChange={chooseImg}
            className="upload-img"
          />
          <img src={avatar} alt="" />
        </div>
      </div>

      <div className="user-input">
        <div className="user-title">昵称</div>
        <Input
          style={{ width: 'calc(100% - 60px)' }}
          value={nickName}
          onChange={(e: any) => {
            setNickName(e.target.value);
          }}
        />
      </div>
      <div className="user-input">
        <div className="user-title">电子邮箱</div>
        <Input
          style={{ width: 'calc(100% - 60px)' }}
          value={email}
          onChange={(e: any) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="user-input">
        <div className="user-title">性别</div>
        <Radio.Group
          onChange={(e: any) => {
            console.log(e.target.value);
            setGender(e.target.value);
          }}
          value={gender + ''}
        >
          <Radio value="0">男</Radio>
          <Radio value="1">女</Radio>
        </Radio.Group>
      </div>
      <div className="user-input">
        <div className="user-title">个性签名</div>
        <TextArea
          autoSize={{ minRows: 5 }}
          placeholder="请输入个性签名"
          style={{ width: 'calc(100% - 60px)', fontSize: '14px' }}
          value={slogan}
          onChange={(e) => {
            setSlogan(e.target.value);
          }}
        />
      </div>
      <div className="user-input">
        <div className="user-title">姓名</div>
        <Input
          placeholder="请输入姓名"
          style={{ width: 'calc(100% - 60px)' }}
          value={trueName}
          onChange={(e: any) => {
            setTrueName(e.target.value);
          }}
        />
      </div>
      <div className="user-input">
        <div className="user-title">生日</div>
        <DatePicker
          value={birthday}
          onChange={handleDateChange}
          format={'YYYY-MM-DD'}
        />
      </div>
      <div className="user-button-info">
        <Button
          type="primary"
          onClick={() => {
            saveuserInfo();
          }}
          style={{ marginRight: '10px' }}
          className={classes.button}
        >
          确认
        </Button>
        <Button onClick={onClose}>取消</Button>
      </div>
      <Modal
        visible={photoVisible}
        onCancel={() => {
          setPhotoVisible(false);
        }}
        onOk={() => {
          uploadImg();
          setPhotoVisible(false);
        }}
        title={'选择图片'}
        centered={true}
      >
        <Cropper
          style={{ width: '100%', height: '95%' }}
          // preview=".uploadCrop"
          guides={true}
          src={upImg}
          ref={cropperRef}
          // aspectRatio={16 / 9}
          preview=".img-preview"
        />
      </Modal>
    </div>
  );
};
UserCenter.defaultProps = {};
export default UserCenter;
