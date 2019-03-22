import fetchMock from "fetch-mock";
import { linkTilPamHardkodetBedrift, MockKallLinkTilPam } from "../lenker";

fetchMock.get(linkTilPamHardkodetBedrift, 200);

fetchMock.get(MockKallLinkTilPam, 401).spy();
