import {FC} from "react";
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
} from "react-native";
import {RootTabScreenProps} from "@/navigators";
import {styled} from "styled-components/native";
import {TransactionItem} from "./TransactionItem";
import {useTransactions} from "@/hooks";
import {EmptyState} from "@/components";

const Title = styled.Text`
    font-size: 16px;
    text-align: center;
    color: ${({theme}) => theme.foreground.primary};
    padding: 8px 0px;
`;

export const ActivityScreen: FC<RootTabScreenProps<"Activity">> = () => {
    const {loading, refreshing, refresh, transactions, loadMore} =
        useTransactions();

    const renderItem = ({item}) => {
        return <TransactionItem {...item} />;
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.signature}
                renderItem={renderItem}
                onEndReached={loadMore}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refresh}/>
                }
                ListHeaderComponent={
                    !loading &&
                    !refreshing &&
                    !transactions.length && (
                        <EmptyState
                            label="You don't have any transactions yet"
                            style={{marginTop: 16}}
                        />
                    )
                }
                ListFooterComponent={loading && <Title>Loading...</Title>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
