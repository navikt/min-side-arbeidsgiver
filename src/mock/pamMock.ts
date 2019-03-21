import fetchMock from "fetch-mock";
import { pamApiLink } from "../lenker";

fetchMock.get(pamApiLink("*"), 401).spy();
