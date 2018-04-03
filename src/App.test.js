import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App, { Search, Button, Table, Loading } from "./App";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Search", () => {
  const props = {
    value: "something",
    onChange() {},
    onSubmit() {}
  };

  const Element = <Search {...props}>Search</Search>;

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(Element, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(Element);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Button", () => {
  const props = {
    onClick() {}
  };

  const Element = <Button {...props}>Give me more</Button>;

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(Element, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(Element);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows passed text", () => {
    const element = shallow(Element);
    expect(element.text()).toEqual("Give me more");
  });
});

describe("Table", () => {
  const props = {
    list: [
      { title: 1, author: "a", num_comments: 1, points: 2, objectID: "y" },
      { title: 2, author: "b", num_comments: 1, points: 2, objectID: "z" }
    ],
    onDismiss() {},
    onSort() {},
    sortKey: "TITLE",
    isSortReverse: false
  };
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<Table {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows two items in list", () => {
    const element = shallow(<Table {...props} />);
    expect(element.find(".table-row").length).toBe(2);
  });
});

describe("Loading", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Loading />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<Loading />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
