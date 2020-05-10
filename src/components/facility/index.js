import React from "react";
import { connect } from "react-redux";
import {
  Header,
  Image,
  Container,
  Button,
  Form,
  Dropdown,
  TextArea,
  Input,
  Icon,
  Grid,
} from "semantic-ui-react";
import { TimeInput } from "semantic-ui-calendar-react";
import {
  getFacility,
  getFacilities,
  editFacility,
} from "../../actions/facilities";
import { facilitiesUrl, facilityUrl } from "../../urls";
import "./index.css";
import moment from "moment"

const options = [
  { key: "mon", text: "Monday", value: "mon" },
  { key: "tue", text: "Tuesday", value: "tue" },
  { key: "wed", text: "Wednesday", value: "wed" },
  { key: "thu", text: "Thursday", value: "thu" },
  { key: "fri", text: "Friday", value: "fri" },
  { key: "sat", text: "Saturday", value: "sat" },
  { key: "sun", text: "Sunday", value: "sun" },
];

class Facility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.activeFacility || 1,
      editMode: false,
      information: "",
      startTime: [""],
      endTime: [""],
      descriptions: [""],
      name: "",
      days: [[]],
    };
  }

  componentDidMount() {
    this.props.setNavigation("Facilities");
    this.props.getFacilities(facilitiesUrl(this.props.who_am_i.residence));
    this.props.getFacility(
      this.props.who_am_i.residence,
      this.state.id,
      this.successCallBack,
      this.errCallBack
    );
  }

  createForm = () => {
    return this.state.descriptions.map((description, i) => (
      <div key={i}>
        <Form.Group>
          <Form.Field>
            <label>Description</label>
            <Input
              icon="angle down"
              value={description || ""}
              onChange={(event) => this.handleDescriptionsChange(i, event)}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <label>Days</label>
            <Dropdown
              name="days"
              placeholder="Select Day"
              multiple
              selection
              options={options}
              value={this.state.days[i]}
              onChange={(event, { value }) =>
                this.handleDaysChange(event, i, value)
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Start time</label>
            <TimeInput
              name="startTime"
              value={this.state.startTime[i]}
              onChange={(event, { value }) =>
                this.handleStartTimeChange(event, i, value)
              }
            />
          </Form.Field>
          <Form.Field>
            <label>End time</label>
            <TimeInput
              name="endTime"
              value={this.state.endTime[i]}
              onChange={(event, { value }) =>
                this.handleEndTimeChange(event, i, value)
              }
            />
          </Form.Field>
          {this.state.descriptions.length > 1 ? (
            <Icon name="close" onClick={() => removeClick(i)} />
          ) : null}
        </Form.Group>
      </div>
    ));
  };

  submitData = () => {
    const { information, startTime, endTime, descriptions } = this.state;

    if (information && descriptions && startTime && endTime) {
      let formData = new FormData();
      formData.append("name", this.state.name);
      formData.append("description", this.state.information);
      let timings = [];
      for (var i = 0; i < this.state.days.length; i++) {
        for (var j = 0; j < this.state.days[i].length; j++) {
          timings.push({
            day: this.state.days[i][j],
            start: this.state.startTime[i],
            end: this.state.endTime[i],
            description: this.state.descriptions[i],
          });
        }
      }
      let data = null;
      if (timings.length > 0) {
        data = {
          description: this.state.information,
          timings: timings,
        };
      } else {
        data = {
          description: this.state.information,
        };
      }
      this.props.editFacility(
        facilityUrl(this.props.who_am_i.residence, this.state.id),
        data,
        this.successCallBack,
        this.errCallBack
      );
    }
    this.toggleEditMode();
  };

  removeClick = (i) => {
    let descriptions = [...this.state.descriptions];
    let startTime = [...this.state.startTime];
    let endTime = [...this.state.endTime];
    descriptions.splice(i, 1);
    startTime.splice(i, 1);
    endTime.splice(i, 1);
    days.splice(i, 1);
    this.setState({
      descriptions,
      startTime,
      endTime,
      days,
    });
  };

  handleDescriptionsChange(i, event) {
    let descriptions = [...this.state.descriptions];
    descriptions[i] = event.target.value;
    this.setState({ descriptions });
  }

  handleDaysChange(event, i, value) {
    let days = [...this.state.days];
    days[i] = value;
    this.setState({ days });
  }

  handleStartTimeChange(event, i, value) {
    let startTime = [...this.state.startTime];
    startTime[i] = value;
    this.setState({ startTime });
  }

  handleEndTimeChange(event, i, value) {
    let endTime = [...this.state.endTime];
    endTime[i] = value;
    this.setState({ endTime });
  }

  addClick = () => {
    this.setState((prevState) => ({
      descriptions: [...prevState.descriptions, ""],
      startTime: [...prevState.startTime, ""],
      endTime: [...prevState.endTime, ""],
      days: [...prevState.days, []],
    }));
  };

  successCallBack = (res) => {
    this.setState({
      success: true,
      error: false,
      message: res.statusText,
      convenientTime: "",
      complain: "",
      category: "",
      information: res.data.description,
      day: [],
      start: [],
      end: [],
      description: [],
    });
  };

  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err,
    });
  };
  toggleEditMode = () => {
    const editMode = this.state.editMode;
    this.setState({
      editMode: !editMode,
    });
  };

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };
  handleFacilityChange = (id) => {
    this.setState({
      id,
    });
    this.props.getFacility(
      this.props.who_am_i.residence,
      id,
      this.successCallBack,
      this.errCallBack
    );
  };

  render() {
    const { facility, facilities } = this.props;
    const { information } = this.state;

    return (
      <Grid.Column>
        <div>
          {facilities && facilities.length > 0
            ? facilities.map((allFacility, index) => {
                return (
                  <Button
                    styleName="button_margin"
                    onClick={() => this.handleFacilityChange(allFacility.id)}
                  >
                    {allFacility.name}
                  </Button>
                );
              })
            : null}
        </div>
        {facility ? (
          <React.Fragment>
            <Header as="h2">{facility.name}</Header>
            <Grid divided="vertically">
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Image
                    src={
                      facility.displayPicture ||
                      "https://react.semantic-ui.com/images/wireframe/image.png"
                    }
                    size="medium"
                  />
                </Grid.Column>
                <Grid.Column>
                  <Container>
                    {this.state.editMode ? (
                      <div>
                        <Header as="h5">Edit Information</Header>
                        <Form>
                          <TextArea
                            name="information"
                            value={information}
                            onChange={this.handleChange}
                            placeholder="Tell us more"
                            fluid
                          />
                          <Header as="h3">Timings</Header>
                          {this.createForm()}
                          <Form.Field>
                            <Icon
                              onClick={this.addClick}
                              name="plus"
                              size="big"
                              styleName="plus-icon"
                            />
                          </Form.Field>
                          <Form.Group>
                            <Form.Button onClick={this.submitData}>
                              Save Changes
                            </Form.Button>
                            <Form.Button onClick={this.toggleEditMode}>
                              Cancel
                            </Form.Button>
                          </Form.Group>
                        </Form>
                        * Filling any timing will rewrite the old timigs with
                        new one
                      </div>
                    ) : (
                      <div>
                        {facility.description}
                        <Header size="small" styleName="low_margin">
                          Timings
                        </Header>
                        {facility.timings && facility.timings.length > 0
                          ? facility.timings.map((timing) => {
                              return (
                                <div>
                                  {timing.description}:{" "}
                                  {moment(timing.start, "hh:mm:ss").format(
                                    "hh:mm A"
                                  )}{" "}
                                  -
                                  {moment(timing.end, "hh:mm:ss").format(
                                    "hh:mm A"
                                  )}
                                </div>
                              );
                            })
                          : null}
                        {this.props.who_am_i.isAdmin && (
                          <Button
                            basic
                            color="blue"
                            onClick={this.toggleEditMode}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    )}
                  </Container>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </React.Fragment>
        ) : null}
      </Grid.Column>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeFacility: state.activeFacility,
    facility: state.facility,
    facilities: state.facilities,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getFacilities: (url) => {
      dispatch(getFacilities(url));
    },
    getFacility: (residence, id, successCallBack, errCallBack) => {
      dispatch(getFacility(residence, id, successCallBack, errCallBack));
    },
    editFacility: (url, data, successCallBack, errCallBack) => {
      dispatch(editFacility(url, data, successCallBack, errCallBack));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Facility);
