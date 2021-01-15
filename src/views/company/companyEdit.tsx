import React, { useState, useEffect, useRef } from 'react';
import './companyEdit.css';
import { useDispatch } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { getUserInfo, setTargetUserKey } from '../../redux/actions/authActions';
import { setMessage } from '../../redux/actions/commonActions';
import { TextField, Button } from '@material-ui/core';
import moment from 'moment';
import _ from 'lodash';
import uploadFile from '../../components/common/upload';
import Dialog from '../../components/common/dialog';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
interface CompanyEditProps {
  targetUser: any;
  setTargetUser: any;
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
const CompanyEdit: React.FC<CompanyEditProps> = (props) => {
  const { targetUser, setTargetUser } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const uploadToken = useTypedSelector((state) => state.auth.uploadToken);
  const [targetUserInfo, setTargetUserInfo] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>(defaultPersonPng);
  const [upImg, setUpImg] = useState<any>(null);
  const [cropper, setCropper] = useState<any>(null);
  const [photoVisible, setPhotoVisible] = useState<any>(false);
  const [trueName, setTrueName] = useState('');
  const [nickName, setNickName] = useState('');
  const [gender, setGender] = useState(0);
  const [birthday, setBirthday] = useState<any>(moment());
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [lunarBirthday, setLunarBirthday] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyContactTel, setEmergencyContactTel] = useState('');
  const [post, setPost] = useState('');
  const [department1, setDepartment1] = useState('');
  const [department2, setDepartment2] = useState('');
  const [department3, setDepartment3] = useState('');
  const [department4, setDepartment4] = useState('');
  const [department5, setDepartment5] = useState('');
  // onChange(date, dateString) {
  //   this.birthday = date;
  // },
  const cropperRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (targetUser) {
      setAvatar(targetUser.avatar ? targetUser.avatar : defaultPersonPng);
      setTrueName(targetUser.trueName ? targetUser.trueName : '');
      setNickName(targetUser.nickName ? targetUser.nickName : '');
      setGender(targetUser.gender ? targetUser.gender : 0);
      setBirthday(moment(targetUser.birthday).format('YYYY-MM-DD'));
      setEmail(targetUser.email ? targetUser.email : '');
      setAddress(targetUser.address ? targetUser.address : '');
      setEmergencyContact(
        targetUser.emergencyContact ? targetUser.emergencyContact : ''
      );
      setEmergencyContactTel(
        targetUser.emergencyContactTel ? targetUser.emergencyContactTel : ''
      );
      setLunarBirthday(
        targetUser.lunarBirthday ? targetUser.lunarBirthday : ''
      );
      setTargetUserInfo(targetUser);
    } else {
      setTargetUserInfo({
        department1: '',
        department2: '',
        department3: '',
        department4: '',
        department5: '',
        nickName: '',
        mobileArea: '+86',
        mobile: '',
        post: '',
        email: '',
        lunarBirthday: '',
        emergencyContact: '',
        emergencyContactTel: '',
        address: '',
        gender: 0,
        birthday: moment().valueOf(),
        avatar: defaultPersonPng,
      });
    }
  }, [targetUser]);
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
        changeTargetUser(url, 'avatar');
      }
    );
  };
  const handleDateChange = (date: any) => {
    setBirthday(date);
    changeTargetUser(date, 'birthday');
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
  const changeTargetUser = (value: any, type: string) => {
    let newTargetUser: any = _.cloneDeep(targetUserInfo);
    newTargetUser[type] = value;
    setTargetUser(newTargetUser);
  };
  return (
    <div className="companyEdit-home-content">
      {targetUser && targetUser._key ? (
        <div className="companyEdit-home-avatar">
          <div className="companyEdit-title">头像</div>
          <div className="companyEdit-home-avatar-img">
            <input
              type="file"
              accept="image/*"
              onChange={chooseImg}
              className="upload-img"
            />
            <img src={avatar} alt="" />
          </div>
        </div>
      ) : null}

      <div className="companyEdit-input">
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
            changeTargetUser(e.target.value, 'nickName');
          }}
        />
      </div>
      {!targetUser || !targetUser._key ? (
        <React.Fragment>
          <div className="companyEdit-input">
            <TextField
              // required
              id="outlined-basic"
              variant="outlined"
              label="部门1"
              className={classes.input}
              style={{ width: '100%' }}
              value={department1}
              onChange={(e: any) => {
                setDepartment1(e.target.value);
                changeTargetUser(e.target.value, 'department1');
              }}
            />
          </div>
          <div className="companyEdit-input">
            <TextField
              // required
              id="outlined-basic"
              variant="outlined"
              label="部门2"
              className={classes.input}
              style={{ width: '100%' }}
              value={department2}
              onChange={(e: any) => {
                setDepartment2(e.target.value);
                changeTargetUser(e.target.value, 'department2');
              }}
            />
          </div>
          <div className="companyEdit-input">
            <TextField
              // required
              id="outlined-basic"
              variant="outlined"
              label="部门3"
              className={classes.input}
              style={{ width: '100%' }}
              value={department3}
              onChange={(e: any) => {
                setDepartment3(e.target.value);
                changeTargetUser(e.target.value, 'department3');
              }}
            />
          </div>
          <div className="companyEdit-input">
            <TextField
              // required
              id="outlined-basic"
              variant="outlined"
              label="部门4"
              className={classes.input}
              style={{ width: '100%' }}
              value={department4}
              onChange={(e: any) => {
                setDepartment4(e.target.value);
                changeTargetUser(e.target.value, 'department4');
              }}
            />
          </div>
          <div className="companyEdit-input">
            <TextField
              // required
              id="outlined-basic"
              variant="outlined"
              label="部门5"
              className={classes.input}
              style={{ width: '100%' }}
              value={department5}
              onChange={(e: any) => {
                setDepartment5(e.target.value);
                changeTargetUser(e.target.value, 'department5');
              }}
            />
          </div>
          <div className="companyEdit-input">
            <TextField
              // required
              id="outlined-basic"
              variant="outlined"
              label="职位"
              className={classes.input}
              style={{ width: '100%' }}
              value={post}
              onChange={(e: any) => {
                setPost(e.target.value);
                changeTargetUser(e.target.value, 'post');
              }}
            />
          </div>
        </React.Fragment>
      ) : null}
      <div className="companyEdit-input">
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
            changeTargetUser(e.target.value, 'email');
          }}
        />
      </div>
      {/* <div className="companyEdit-input">
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
            changeTargetUser(e.target.value, 'trueName');
          }}
        />
      </div> */}
      <div className="companyEdit-input">
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
            style={{ width: '100%' }}
          />
        </MuiPickersUtilsProvider>
      </div>
      <div className="companyEdit-input">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="手机"
          className={classes.input}
          style={{ width: '100%' }}
          value={mobile}
          onChange={(e: any) => {
            setMobile(e.target.value);
            changeTargetUser(e.target.value, 'mobile');
          }}
        />
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="地址"
          className={classes.input}
          style={{ width: '100%' }}
          value={address}
          onChange={(e: any) => {
            setAddress(e.target.value);
            changeTargetUser(e.target.value, 'address');
          }}
        />
      </div>
      <div className="companyEdit-input">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="农历生日"
          className={classes.input}
          style={{ width: '100%' }}
          value={lunarBirthday}
          onChange={(e: any) => {
            setLunarBirthday(e.target.value);
            changeTargetUser(e.target.value, 'lunarBirthday');
          }}
        />
      </div>
      <div className="companyEdit-input">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="紧急联系人"
          className={classes.input}
          style={{ width: '100%' }}
          value={emergencyContact}
          onChange={(e: any) => {
            setEmergencyContact(e.target.value);
            changeTargetUser(e.target.value, 'emergencyContact');
          }}
        />
      </div>
      <div className="companyEdit-input">
        <TextField
          // required
          id="outlined-basic"
          variant="outlined"
          label="紧急联系人电话"
          className={classes.input}
          style={{ width: '100%' }}
          value={emergencyContactTel}
          onChange={(e: any) => {
            setEmergencyContactTel(e.target.value);
            changeTargetUser(e.target.value, 'emergencyContactTel');
          }}
        />
      </div>
      <Dialog
        visible={photoVisible}
        onClose={() => {
          setPhotoVisible(false);
        }}
        onOK={() => {
          uploadImg();
          setPhotoVisible(false);
        }}
        title={'选择图片'}
        dialogStyle={{
          // position: 'fixed',
          // top: '65px',
          // right: '10px',
          width: '600px',
          height: '700px',
          // maxHeight: 'calc(100% - 66px)',
          // overflow: 'auto',
        }}
        // showMask={false}
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
      </Dialog>
    </div>
  );
};
CompanyEdit.defaultProps = {};
export default CompanyEdit;
