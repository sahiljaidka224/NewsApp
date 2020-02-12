import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, StatusBar, Image, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import moment from 'moment-timezone';


const API_KEY : string = '58e1c4ed0abc4a4b99602b1e05db0405';
const NEWS_FEED_URL : string = `https://newsapi.org/v2/top-headlines?country=au&category=business&apiKey=${API_KEY}`;

interface State {
  isLoading: boolean;
  articles: Article[] | [];
};

interface Article {
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  source: Source;
};

interface Source {
  id: string | null;
  name: string;
};

export default class App extends React.Component<{}, State> {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      articles: []
    };
  }

  public componentDidMount() {

    return fetch(NEWS_FEED_URL)
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({
          isLoading: false,
          articles: resJson && resJson.articles ? resJson.articles : []
        });
      });
  }

  public render() {
    const { isLoading, articles } = this.state;

    return (
      <SafeAreaView style ={styles.safeAreaView}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>NEWS APP</Text>
            </View>
            {isLoading && <ActivityIndicator/>}
            <Text style={{textAlign: "center"}}>{isLoading ? 'Loading' : ''}</Text>
            <FlatList style={styles.flatlist}
              data={articles}
              renderItem={this.flatListRender}
              key={Math.random().toString()}
              removeClippedSubviews={true}
              refreshing={isLoading}
              onRefresh={() => {
                if (!isLoading) this.componentDidMount()
              }}
            />
          </View>
        </SafeAreaView>
      );
  }

  public flatListRender = ({item}) => {
    
    return (
      <View style ={styles.article}>
        {item.urlToImage && 
        <ImageBackground style={styles.image} source={{uri: `${item.urlToImage}`}}>
          <View style={{position: 'absolute', top: '60%', left: '0%', right: '0%', bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#fff'}}>{item.title}</Text>
          </View>
        </ImageBackground>}
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.publisherDetails}>{`by ${item.author ? item.author : 'NA'} on ${moment(item.publishedAt).tz('Australia/Melbourne').format('MMM Do YYYY hA')}`}</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 0.09,
    backgroundColor: '#a5a6f5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 0,
    fontSize: 20,
    textAlignVertical: 'center'
  },
  article: {
    padding: 7,
    margin: 10,
    marginTop: 8,
    marginBottom: 8,
    borderColor: '#a5a6f5',
    borderWidth: 1,
    borderRadius: 8,
  },
  flatlist: {
    flex: 1,
  },
  content: {
    margin: 5,
    fontWeight: '400',
    fontSize: 16
  },
  safeAreaView: {
    marginTop: Constants.statusBarHeight,
    flex: 1
  },
  image: {
    resizeMode: 'cover',
    minWidth: 200,
    minHeight: 250,
  },
  publisherDetails: {
    textAlign: 'right',
    marginTop: 15,
    marginRight: 10,
    fontWeight: '100'
  }
});
